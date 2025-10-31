import React, { useState } from 'react';
import { Heart, Zap, Archive, Waves, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { MaunAppContext } from '../../../store/maun-apps.store';

interface EmotionalAppProps {
  context: MaunAppContext;
}

type EmotionalStep = 'experience' | 'trigger' | 'vault' | 'sit' | 'respond';

export function EmotionalApp({ context }: EmotionalAppProps) {
  const [currentStep, setCurrentStep] = useState<EmotionalStep>('experience');
  const [emotionData, setEmotionData] = useState({
    emotion: '',
    category: '',
    trigger: '',
    context: '',
    response: ''
  });

  const steps = [
    {
      id: 'experience' as EmotionalStep,
      name: 'Experience',
      icon: <Heart className="h-5 w-5" />,
      description: 'What are you feeling right now?',
      color: 'bg-pink-500'
    },
    {
      id: 'trigger' as EmotionalStep,
      name: 'Trigger',
      icon: <Zap className="h-5 w-5" />,
      description: 'What sparked this feeling?',
      color: 'bg-yellow-500'
    },
    {
      id: 'vault' as EmotionalStep,
      name: 'Vault',
      icon: <Archive className="h-5 w-5" />,
      description: 'Process now or store for later?',
      color: 'bg-purple-500'
    },
    {
      id: 'sit' as EmotionalStep,
      name: 'Sit',
      icon: <Waves className="h-5 w-5" />,
      description: 'Sit with your feelings mindfully',
      color: 'bg-blue-500'
    },
    {
      id: 'respond' as EmotionalStep,
      name: 'Respond',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'How will you respond?',
      color: 'bg-green-500'
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const emotions = [
    'Joy', 'Sadness', 'Anger', 'Fear', 'Disgust', 'Surprise',
    'Love', 'Guilt', 'Shame', 'Pride', 'Envy', 'Gratitude',
    'Hope', 'Anxiety', 'Excitement', 'Frustration'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 'experience':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-6">What's surfacing for you?</h3>
            <div className="grid grid-cols-4 gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => setEmotionData({ ...emotionData, emotion })}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    emotionData.emotion === emotion
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
            {emotionData.emotion && (
              <div className="text-center">
                <p className="text-lg text-pink-200 mb-4">
                  You're experiencing <strong>{emotionData.emotion}</strong>
                </p>
                <Button onClick={handleNext} className="bg-pink-500 hover:bg-pink-600">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        );

      case 'trigger':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-6">What triggered this feeling?</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Context</label>
                <textarea
                  value={emotionData.context}
                  onChange={(e) => setEmotionData({ ...emotionData, context: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                  placeholder="Describe the situation or environment..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Trigger Event</label>
                <textarea
                  value={emotionData.trigger}
                  onChange={(e) => setEmotionData({ ...emotionData, trigger: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                  placeholder="What specifically happened that sparked this feeling?"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!emotionData.trigger}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'vault':
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold mb-6">Process or Store?</h3>
            <p className="text-lg text-purple-200 mb-8">
              You can either process this emotion now or store it safely for later when you have more time.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="p-6 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                onClick={handleNext}
              >
                <div className="text-3xl mb-4">🔄</div>
                <h4 className="text-xl font-semibold mb-2">Process Now</h4>
                <p className="text-purple-200">Take time to sit with and process this emotion</p>
              </div>
              <div
                className="p-6 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => {
                  // Store in vault and close
                  context.onClose();
                }}
              >
                <div className="text-3xl mb-4">🗃️</div>
                <h4 className="text-xl font-semibold mb-2">Store for Later</h4>
                <p className="text-purple-200">Safely store this emotion to process when ready</p>
              </div>
            </div>
          </div>
        );

      case 'sit':
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold mb-6">Mindful Sitting</h3>
            <div className="bg-white/10 rounded-lg p-8">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <p className="text-lg text-blue-200 mb-6">
                Take a moment to sit quietly with your {emotionData.emotion?.toLowerCase()}.
                Notice where you feel it in your body. Breathe with it.
              </p>
              <div className="space-y-3 text-sm text-blue-200">
                <p>• Close your eyes and take three deep breaths</p>
                <p>• Notice physical sensations without judgment</p>
                <p>• Allow the feeling to be present without trying to change it</p>
                <p>• When ready, open your eyes and continue</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
              <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600">
                I'm Ready <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'respond':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-6">How will you respond?</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Response Plan</label>
                <textarea
                  value={emotionData.response}
                  onChange={(e) => setEmotionData({ ...emotionData, response: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                  placeholder="How will you respond to this situation? What action will you take?"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
              <Button
                onClick={() => {
                  // Complete the process
                  context.onClose();
                }}
                disabled={!emotionData.response}
                className="bg-green-500 hover:bg-green-600"
              >
                Complete Process
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index <= currentStepIndex
                      ? currentStepData.color
                      : 'bg-white/20'
                  } transition-colors`}
                >
                  {step.icon}
                </div>
                <span className="text-xs mt-1 text-center">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 ${
                    index < currentStepIndex ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
          {renderStepContent()}
        </div>

        {/* Close Button */}
        <div className="text-center mt-8">
          <Button
            onClick={context.onClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Close Emotional Processing
          </Button>
        </div>
      </div>
    </div>
  );
}