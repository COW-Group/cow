"use client"

import React, { useState, useEffect } from "react"
import { useVisionData } from "@/lib/vision-data-provider"
import { databaseService } from "@/lib/database-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { XIcon, EditIcon, CheckIcon } from "lucide-react"
import type { Range, Mountain, Hill, Terrain, Length, Step, TaskList } from "@/lib/types"

interface DailyPlan {
  id?: string
  userId: string
  date: string
  goals: { id: string; type: string; name: string }[]
  typedGoals: { id: string; type: string; typedName: string }[]
  quote: string
  targets: { stepId: string; goalId: string; taskListId?: string }[]
  successes: string[]
  reviewTypedGoals: { id: string; type: string; typedName: string }[]
  taskListIds: { goalId: string; taskListId: string }[]
  createdAt?: string
  updatedAt?: string
}

export const DailyPlanner: React.FC = () => {
  const { ranges } = useVisionData()
  const [selectedGoals, setSelectedGoals] = useState<{ id: string; type: string; name: string }[]>([])
  const [typedGoals, setTypedGoals] = useState<{ id: string; type: string; typedName: string }[]>([])
  const [reviewTypedGoals, setReviewTypedGoals] = useState<{ id: string; type: string; typedName: string }[]>([])
  const [quote, setQuote] = useState("")
  const [selectedTargets, setSelectedTargets] = useState<{ stepId: string; goalId: string; taskListId?: string }[]>([])
  const [newSuccess, setNewSuccess] = useState("")
  const [successes, setSuccesses] = useState<string[]>([])
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    return today.toISOString().split("T")[0];
  })
  const [planId, setPlanId] = useState<string | null>(null)
  const [editingSuccessIndex, setEditingSuccessIndex] = useState<number | null>(null)
  const [editingSuccessText, setEditingSuccessText] = useState("")

  useEffect(() => {
    const fetchPlanAndTaskLists = async () => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "");
        // Fetch daily plan
        const plan = await databaseService.fetchDailyPlan(userId, selectedDate);
        if (plan) {
          setPlanId(plan.id);
          setSelectedGoals(plan.goals || []);
          setTypedGoals(plan.typedGoals || []);
          setReviewTypedGoals(plan.reviewTypedGoals || []);
          setQuote(plan.quote || "");
          setSelectedTargets(plan.targets || []);
          setSuccesses(plan.successes || []);
          console.log("[DailyPlanner] Loaded plan for date:", selectedDate, "Plan:", plan);
        } else {
          setPlanId(null);
          setSelectedGoals([]);
          setTypedGoals([]);
          setReviewTypedGoals([]);
          setQuote("");
          setSelectedTargets([]);
          setSuccesses([]);
          console.log("[DailyPlanner] No plan found for date:", selectedDate);
        }
        // Fetch all task lists
        const taskLists = await databaseService.fetchTaskLists(userId);
        setTaskLists(taskLists);
        console.log("[DailyPlanner] Loaded task lists:", taskLists);
      } catch (err: any) {
        console.error("[DailyPlanner] Failed to fetch daily plan or task lists:", err);
        toast.error("Failed to load daily plan or task lists.");
      }
    };
    fetchPlanAndTaskLists();
  }, [selectedDate]);

  const handleGoalSelection = async (value: string) => {
    const [type, id] = value.split("|");
    let name = "";
    let found = false;

    for (const range of ranges) {
      if (type === "range" && range.id === id) {
        name = range.name;
        found = true;
        break;
      }
      for (const mountain of range.mountains) {
        if (type === "mountain" && mountain.id === id) {
          name = mountain.name;
          found = true;
          break;
        }
        for (const hill of mountain.hills) {
          if (type === "hill" && hill.id === id) {
            name = hill.name;
            found = true;
            break;
          }
          for (const terrain of hill.terrains) {
            if (type === "terrain" && terrain.id === id) {
              name = terrain.name;
              found = true;
              break;
            }
            for (const length of terrain.lengths) {
              if (type === "length" && length.id === id) {
                name = length.name;
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (found) break;
        }
        if (found) break;
      }
      if (found) break;
    }

    if (found && !selectedGoals.some((goal) => goal.id === id && goal.type === type)) {
      const newGoal = { id, type, name };
      console.log("[handleGoalSelection] Adding goal:", newGoal);
      setSelectedGoals([...selectedGoals, newGoal]);
      setTypedGoals([...typedGoals, { id, type, typedName: "" }]);
      setReviewTypedGoals([...reviewTypedGoals, { id, type, typedName: "" }]);

      // Create a task list for the new goal
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "");
        const taskList = await databaseService.createTaskList(userId, `${name} Tasks (${selectedDate})`, taskLists.length);
        setTaskLists([...taskLists, taskList]);
        console.log("[handleGoalSelection] Created task list for goal:", taskList);
      } catch (err: any) {
        console.error("[handleGoalSelection] Failed to create task list:", err);
        toast.error("Failed to create task list for goal.");
      }
    }
  };

  const removeGoal = async (id: string, type: string) => {
    const taskList = taskLists.find(tl => tl.name.includes(selectedGoals.find(g => g.id === id)?.name || ""));
    setSelectedGoals(selectedGoals.filter((goal) => !(goal.id === id && goal.type === type)));
    setTypedGoals(typedGoals.filter((goal) => !(goal.id === id && goal.type === type)));
    setReviewTypedGoals(reviewTypedGoals.filter((goal) => !(goal.id === id && goal.type === type)));
    setSelectedTargets(selectedTargets.filter((target) => target.goalId !== id));
    if (taskList) {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "");
        await databaseService.deleteTaskList(taskList.id, userId);
        setTaskLists(taskLists.filter(tl => tl.id !== taskList.id));
        console.log("[removeGoal] Deleted task list:", taskList.id);
      } catch (err: any) {
        console.error("[removeGoal] Failed to delete task list:", err);
        toast.error("Failed to delete task list.");
      }
    }
  };

  const handleTypedGoalChange = (id: string, type: string, typedName: string) => {
    setTypedGoals(
      typedGoals.map((goal) =>
        goal.id === id && goal.type === type ? { ...goal, typedName } : goal,
      ),
    );
  };

  const handleReviewTypedGoalChange = (id: string, type: string, typedName: string) => {
    setReviewTypedGoals(
      reviewTypedGoals.map((goal) =>
        goal.id === id && goal.type === type ? { ...goal, typedName } : goal,
      ),
    );
  };

  const handleTaskListChange = async (stepId: string, goalId: string, taskListId: string) => {
    try {
      const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "");
      // Update the step's task_list_id in the database
      const updatedStep = await databaseService.updateStep(stepId, userId, { taskListId });
      // Update selectedTargets to reflect the new taskListId
      setSelectedTargets(
        selectedTargets.map((target) =>
          target.stepId === stepId && target.goalId === goalId
            ? { ...target, taskListId }
            : target
        )
      );
      console.log("[handleTaskListChange] Updated step task_list_id:", updatedStep);
      toast.success("Step assigned to task list successfully!");
    } catch (err: any) {
      console.error("[handleTaskListChange] Failed to update step task_list_id:", err);
      toast.error("Failed to assign step to task list.");
    }
  };

  const saveQuote = async () => {
    if (!quote.trim()) {
      toast.error("Quote cannot be empty.");
      return;
    }
    try {
      const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "");
      const dailyPlan: DailyPlan = {
        userId,
        date: selectedDate,
        goals: selectedGoals,
        typedGoals,
        quote,
        targets: selectedTargets,
        successes,
        reviewTypedGoals,
        taskListIds: selectedGoals.map(goal => ({
          goalId: goal.id,
          taskListId: taskLists.find(tl => tl.name.includes(goal.name))?.id || "",
        })),
      };
      console.log("[saveQuote] Saving plan with quote:", dailyPlan);
      let result;
      if (planId) {
        result = await databaseService.updateDailyPlan(planId, userId, dailyPlan);
      } else {
        result = await databaseService.createDailyPlan(userId, dailyPlan);
      }
      console.log("[saveQuote] Saved plan with quote:", result);
      setPlanId(result.id);
      toast.success("Quote saved successfully!");
    } catch (err: any) {
      console.error("[saveQuote] Failed to save quote:", err);
      toast.error("Failed to save quote: " + err.message);
    }
  };

  const handleTargetSelection = (goalId: string, stepId: string) => {
    if (!selectedTargets.some((target) => target.stepId === stepId && target.goalId === goalId)) {
      // Assign step to "No Task List" by default (taskListId: undefined)
      setSelectedTargets([...selectedTargets, { stepId, goalId, taskListId: undefined }]);
      console.log("[handleTargetSelection] Added step to targets with no task list:", { stepId, goalId });
    }
  };

  const removeTarget = (stepId: string, goalId: string) => {
    setSelectedTargets(selectedTargets.filter((target) => !(target.stepId === stepId && target.goalId === goalId)));
  };

  const addSuccess = () => {
    if (!newSuccess.trim()) {
      toast.error("Success description cannot be empty.");
      return;
    }
    setSuccesses([...successes, newSuccess]);
    setNewSuccess("");
  };

  const editSuccess = (index: number) => {
    setEditingSuccessIndex(index);
    setEditingSuccessText(successes[index]);
  };

  const saveEditedSuccess = () => {
    if (editingSuccessIndex === null || !editingSuccessText.trim()) {
      toast.error("Success description cannot be empty.");
      return;
    }
    setSuccesses(
      successes.map((success, i) =>
        i === editingSuccessIndex ? editingSuccessText : success,
      ),
    );
    setEditingSuccessIndex(null);
    setEditingSuccessText("");
  };

  const cancelEditSuccess = () => {
    setEditingSuccessIndex(null);
    setEditingSuccessText("");
  };

  const deleteSuccess = (index: number) => {
    setSuccesses(successes.filter((_, i) => i !== index));
  };

  const getStepsForGoal = (goal: { id: string; type: string }) => {
    const steps: Step[] = [];
    const path: string[] = [];
    for (const range of ranges) {
      if (goal.type === "range" && range.id !== goal.id) continue;
      path.push(`Range: ${range.name}`);
      for (const mountain of range.mountains) {
        if (goal.type === "mountain" && mountain.id !== goal.id && goal.type !== "range") continue;
        path.push(`Mountain: ${mountain.name}`);
        for (const hill of mountain.hills) {
          if (goal.type === "hill" && hill.id !== goal.id && goal.type !== "range" && goal.type !== "mountain") continue;
          path.push(`Hill: ${hill.name}`);
          for (const terrain of hill.terrains) {
            if (goal.type === "terrain" && terrain.id !== goal.id && goal.type !== "range" && goal.type !== "mountain" && goal.type !== "hill") continue;
            path.push(`Terrain: ${terrain.name}`);
            for (const length of terrain.lengths) {
              if (goal.type === "length" && length.id !== goal.id && goal.type !== "range" && goal.type !== "mountain" && goal.type !== "hill" && goal.type !== "terrain") continue;
              path.push(`Length: ${length.name} (Steps: ${length.steps.length})`);
              steps.push(...length.steps);
            }
          }
        }
      }
    }
    console.log("[getStepsForGoal] Goal:", goal, "Path:", path, "Steps:", steps.map(s => ({ id: s.id, label: s.label, taskListId: s.taskListId })));
    return steps;
  };

  const saveDailyPlan = async () => {
    console.log("[saveDailyPlan] Starting save process for date:", selectedDate, "planId:", planId);
    console.log("[saveDailyPlan] Current state:", {
      selectedGoals,
      typedGoals,
      reviewTypedGoals,
      quote,
      selectedTargets,
      successes,
      taskLists,
      planId,
    });

    try {
      const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "");
      console.log("[saveDailyPlan] User ID:", userId);

      // Update task_list_id for each step in selectedTargets
      for (const target of selectedTargets) {
        if (target.taskListId) {
          console.log("[saveDailyPlan] Updating step:", target.stepId, "with taskListId:", target.taskListId);
          await databaseService.updateStep(target.stepId, userId, { taskListId: target.taskListId });
        }
      }

      const dailyPlan: DailyPlan = {
        userId,
        date: selectedDate,
        goals: selectedGoals,
        typedGoals,
        quote,
        targets: selectedTargets,
        successes,
        reviewTypedGoals,
        taskListIds: selectedGoals.map(goal => {
          const taskList = taskLists.find(tl => tl.name.includes(goal.name));
          if (!taskList) {
            console.warn("[saveDailyPlan] No task list found for goal:", goal);
            return { goalId: goal.id, taskListId: "" };
          }
          return { goalId: goal.id, taskListId: taskList.id };
        }),
      };
      console.log("[saveDailyPlan] Saving plan for date:", selectedDate, "Plan ID:", planId, "Plan:", dailyPlan);
      let result;
      if (planId) {
        console.log("[saveDailyPlan] Updating existing plan with ID:", planId);
        result = await databaseService.updateDailyPlan(planId, userId, dailyPlan);
      } else {
        console.log("[saveDailyPlan] Creating new plan for date:", selectedDate);
        result = await databaseService.createDailyPlan(userId, dailyPlan);
      }
      console.log("[saveDailyPlan] Supabase response:", { id: result.id, error: result.error });
      setPlanId(result.id);
      toast.success("Daily plan saved successfully!");
    } catch (err: any) {
      console.error("[saveDailyPlan] Failed to save daily plan:", err);
      toast.error("Failed to save daily plan: " + err.message);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-cream-25">
      <CardHeader>
        <CardTitle>
          Daily Planner
          <div className="mt-2">
            <Label htmlFor="date-picker" className="text-sm font-semibold">Select Date</Label>
            <Input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                console.log("[DailyPlanner] Selected date:", e.target.value);
                setSelectedDate(e.target.value);
              }}
              className="bg-white/20 border-white/30 text-cream-25 w-40 ml-2"
            />
            <p className="text-sm mt-1">Selected: {selectedDate}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Select Goals */}
        <div>
          <Label className="text-lg font-semibold">Select Goals</Label>
          <Select onValueChange={handleGoalSelection}>
            <SelectTrigger className="bg-white/20 border-white/30 text-cream-25">
              <SelectValue placeholder="Select a goal..." />
            </SelectTrigger>
            <SelectContent className="bg-deep-blue text-cream-25 max-h-60 overflow-y-auto">
              {ranges.map((range) => (
                <React.Fragment key={range.id}>
                  <SelectItem value={`range|${range.id}`}>{range.name} (Range)</SelectItem>
                  {range.mountains.map((mountain) => (
                    <React.Fragment key={mountain.id}>
                      <SelectItem value={`mountain|${mountain.id}`}>{mountain.name} (Mountain)</SelectItem>
                      {mountain.hills.map((hill) => (
                        <React.Fragment key={hill.id}>
                          <SelectItem value={`hill|${hill.id}`}>{hill.name} (Hill)</SelectItem>
                          {hill.terrains.map((terrain) => (
                            <React.Fragment key={terrain.id}>
                              <SelectItem value={`terrain|${terrain.id}`}>{terrain.name} (Terrain)</SelectItem>
                              {terrain.lengths.map((length) => (
                                <SelectItem key={length.id} value={`length|${length.id}`}>
                                  {length.name} (Length)
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
          <ul className="mt-2 space-y-1">
            {selectedGoals.map((goal) => (
              <li key={`${goal.type}|${goal.id}`} className="flex items-center gap-2">
                <span>{goal.name} ({goal.type.charAt(0).toUpperCase() + goal.type.slice(1)})</span>
                <Button variant="ghost" size="sm" onClick={() => removeGoal(goal.id, goal.type)}>
                  <XIcon className="h-4 w-4 text-red-400" />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: Type Today's Goals */}
        <div>
          <Label className="text-lg font-semibold">Type Today's Goals</Label>
          <p className="text-sm text-cream-25/70 mb-2">Type each goal to commit it to memory (optional).</p>
          {selectedGoals.map((goal) => (
            <div key={`${goal.type}|${goal.id}`} className="flex items-center gap-2 mb-2">
              <Input
                value={typedGoals.find((tg) => tg.id === goal.id && tg.type === goal.type)?.typedName || ""}
                onChange={(e) => handleTypedGoalChange(goal.id, goal.type, e.target.value)}
                placeholder={`Type: ${goal.name}`}
                className="bg-white/20 border-white/30 text-cream-25"
              />
              <span className="text-sm text-cream-25/70">({goal.type.charAt(0).toUpperCase() + goal.type.slice(1)})</span>
            </div>
          ))}
        </div>

        {/* Section 3: Quote of the Day */}
        <div>
          <Label htmlFor="quote" className="text-lg font-semibold">Quote of the Day</Label>
          <Input
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Enter your quote..."
            className="bg-white/20 border-white/30 text-cream-25"
          />
          <Button onClick={saveQuote} className="mt-2">Save Quote</Button>
        </div>

        {/* Section 4: Select Step Targets */}
        <div>
          <Label className="text-lg font-semibold">Select Step Targets</Label>
          {selectedGoals.map((goal) => {
            const steps = getStepsForGoal(goal);
            return (
              <div key={`${goal.type}|${goal.id}`} className="mt-2">
                <h4 className="font-medium">{goal.name} Steps</h4>
                {steps.length > 0 ? (
                  <Select onValueChange={(value) => handleTargetSelection(goal.id, value)}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-cream-25">
                      <SelectValue placeholder="Select a step..." />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-blue text-cream-25">
                      {steps.map((step) => (
                        <SelectItem key={step.id} value={step.id}>
                          {step.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-cream-25/70">No steps available for this goal.</p>
                )}
                <ul className="mt-2 space-y-1">
                  {selectedTargets
                    .filter((target) => target.goalId === goal.id)
                    .map((target) => {
                      const step = steps.find((s) => s.id === target.stepId);
                      return (
                        <li key={target.stepId} className="flex items-center gap-2">
                          <span>{step?.label}</span>
                          <Select
                            value={target.taskListId || ""}
                            onValueChange={(value) => handleTaskListChange(target.stepId, goal.id, value)}
                          >
                            <SelectTrigger className="bg-white/20 border-white/30 text-cream-25 w-48">
                              <SelectValue placeholder="No Task List" />
                            </SelectTrigger>
                            <SelectContent className="bg-deep-blue text-cream-25">
                              <SelectItem value="">No Task List</SelectItem>
                              {taskLists.map((taskList) => (
                                <SelectItem key={taskList.id} value={taskList.id}>
                                  {taskList.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm" onClick={() => removeTarget(target.stepId, goal.id)}>
                            <XIcon className="h-4 w-4 text-red-400" />
                          </Button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Section 5: Successes for Today */}
        <div>
          <Label className="text-lg font-semibold">Successes for Today</Label>
          <div className="flex gap-2">
            <Input
              value={newSuccess}
              onChange={(e) => setNewSuccess(e.target.value)}
              placeholder="Add a success..."
              className="bg-white/20 border-white/30 text-cream-25"
            />
            <Button onClick={addSuccess}>Add</Button>
          </div>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            {successes.map((success, index) => (
              <li key={index} className="flex items-center gap-2">
                {editingSuccessIndex === index ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editingSuccessText}
                      onChange={(e) => setEditingSuccessText(e.target.value)}
                      className="bg-white/20 border-white/30 text-cream-25"
                    />
                    <Button variant="ghost" size="sm" onClick={saveEditedSuccess}>
                      <CheckIcon className="h-4 w-4 text-green-400" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEditSuccess}>
                      <XIcon className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{success}</span>
                    <Button variant="ghost" size="sm" onClick={() => editSuccess(index)}>
                      <EditIcon className="h-4 w-4 text-vibrant-blue" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSuccess(index)}>
                      <XIcon className="h-4 w-4 text-red-400" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 6: Type Review Goals */}
        <div>
          <Label className="text-lg font-semibold">Type Review Goals</Label>
          <p className="text-sm text-cream-25/70 mb-2">Type each goal again to reinforce memory (optional).</p>
          {selectedGoals.map((goal) => (
            <div key={`${goal.type}|${goal.id}`} className="flex items-center gap-2 mb-2">
              <Input
                value={reviewTypedGoals.find((rtg) => rtg.id === goal.id && rtg.type === goal.type)?.typedName || ""}
                onChange={(e) => handleReviewTypedGoalChange(goal.id, goal.type, e.target.value)}
                placeholder={`Type: ${goal.name}`}
                className="bg-white/20 border-white/30 text-cream-25"
              />
              <span className="text-sm text-cream-25/70">({goal.type.charAt(0).toUpperCase() + goal.type.slice(1)})</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            console.log("[DailyPlanner] Save Daily Plan button clicked, date:", selectedDate);
            saveDailyPlan();
          }}
          className="w-full"
          disabled={selectedGoals.length === 0}
        >
          Save Daily Plan
        </Button>
      </CardContent>
    </Card>
  );
};