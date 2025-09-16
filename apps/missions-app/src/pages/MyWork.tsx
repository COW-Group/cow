import React, { useState, useEffect } from 'react';
import { MyWorkHeader } from '../components/mywork/MyWorkHeader';
import { EmptyState } from '../components/mywork/EmptyState';
import { AssignedItemsTable } from '../components/mywork/AssignedItemsTable';
import { CustomizableHomePage } from '../components/home/CustomizableHomePage';
import { Button } from '../components/ui/Button';
import { LayoutDashboard, CheckSquare } from 'lucide-react';
import {
  MyWorkData,
  MyWorkView,
  DateViewOption,
  Assignment
} from '../types/mywork.types';

// Mock API function - replace with actual API call
const fetchMyWorkData = async (): Promise<MyWorkData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - initially empty, can be populated for testing
  const mockAssignments: Assignment[] = [
    // Uncomment to test with populated data:
    // {
    //   id: '1',
    //   item: {
    //     id: 'item-1',
    //     name: 'Follow up with client about Q4 requirements',
    //     board: {
    //       id: 'board-1',
    //       name: 'Leads CRM',
    //       color: '#3B82F6'
    //     },
    //     status: {
    //       id: 'status-1',
    //       label: 'Working on it',
    //       color: '#FFA500'
    //     },
    //     date: '2025-01-15',
    //     persons: [
    //       { id: 'person-1', name: 'John Doe', avatar: null },
    //       { id: 'person-2', name: 'Jane Smith', avatar: null }
    //     ],
    //     priority: 'high',
    //     description: 'Client requested detailed proposal for Q4 implementation',
    //     createdAt: new Date('2025-01-10T10:00:00Z'),
    //     updatedAt: new Date('2025-01-12T14:30:00Z')
    //   },
    //   assignedAt: new Date('2025-01-10T10:00:00Z'),
    //   assignedBy: 'Manager',
    //   isCompleted: false,
    //   isOverdue: false
    // },
    // {
    //   id: '2',
    //   item: {
    //     id: 'item-2',
    //     name: 'Review contract terms and send updates',
    //     board: {
    //       id: 'board-2',
    //       name: 'Deals Pipeline',
    //       color: '#10B981'
    //     },
    //     status: {
    //       id: 'status-2',
    //       label: 'In Progress',
    //       color: '#3B82F6'
    //     },
    //     date: '2025-01-12',
    //     persons: [
    //       { id: 'person-3', name: 'Mike Wilson', avatar: null }
    //     ],
    //     priority: 'medium',
    //     createdAt: new Date('2025-01-08T09:00:00Z'),
    //     updatedAt: new Date('2025-01-11T16:00:00Z')
    //   },
    //   assignedAt: new Date('2025-01-08T09:00:00Z'),
    //   assignedBy: 'Legal Team',
    //   isCompleted: false,
    //   isOverdue: true
    // }
  ];

  return {
    assignments: mockAssignments,
    totalCount: mockAssignments.length,
    pendingCount: mockAssignments.filter(a => !a.isCompleted).length,
    completedCount: mockAssignments.filter(a => a.isCompleted).length
  };
};

export function MyWork() {
  const [data, setData] = useState<MyWorkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<MyWorkView>('table');
  const [dateView, setDateView] = useState<DateViewOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDashboard, setShowDashboard] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchMyWorkData();
        setData(result);
      } catch (error) {
        console.error('Failed to load My Work data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort assignments
  const filteredAssignments = React.useMemo(() => {
    if (!data?.assignments) return [];

    let filtered = data.assignments.filter(assignment => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesItem = assignment.item.name.toLowerCase().includes(query);
        const matchesBoard = assignment.item.board.name.toLowerCase().includes(query);
        const matchesStatus = assignment.item.status.label.toLowerCase().includes(query);
        
        if (!matchesItem && !matchesBoard && !matchesStatus) {
          return false;
        }
      }

      // Date filter
      if (dateView !== 'all') {
        const now = new Date();
        const assignedDate = assignment.assignedAt;
        const dueDate = new Date(assignment.item.date);
        
        switch (dateView) {
          case 'today':
            return assignedDate.toDateString() === now.toDateString() ||
                   dueDate.toDateString() === now.toDateString();
          case 'week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return (assignedDate >= weekStart && assignedDate <= weekEnd) ||
                   (dueDate >= weekStart && dueDate <= weekEnd);
          case 'month':
            return (assignedDate.getMonth() === now.getMonth() && 
                    assignedDate.getFullYear() === now.getFullYear()) ||
                   (dueDate.getMonth() === now.getMonth() && 
                    dueDate.getFullYear() === now.getFullYear());
          default:
            return true;
        }
      }

      return true;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.item.name;
          bValue = b.item.name;
          break;
        case 'date':
          aValue = new Date(a.item.date);
          bValue = new Date(b.item.date);
          break;
        case 'status':
          aValue = a.item.status.label;
          bValue = b.item.status.label;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data?.assignments, searchQuery, dateView, sortField, sortDirection]);

  const handleNewItem = () => {
    // TODO: Open modal for creating new item with board selector
    console.log('Open new item modal');
  };

  const handleHelp = () => {
    // TODO: Open help modal or navigate to help page
    console.log('Open help');
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (assignmentId: string, newStatusId: string) => {
    // TODO: Update status via API
    console.log('Update status:', assignmentId, newStatusId);
  };

  const handleDateChange = (assignmentId: string, newDate: string) => {
    // TODO: Update date via API
    console.log('Update date:', assignmentId, newDate);
  };

  const handleItemDelete = (assignmentId: string) => {
    // TODO: Delete item via API
    console.log('Delete item:', assignmentId);
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    // TODO: Handle bulk actions
    console.log('Bulk action:', action, selectedIds);
    setSelectedItems([]);
  };

  const hasAssignments = !loading && data && data.totalCount > 0;

  // Show dashboard view
  if (showDashboard) {
    return (
      <div className="flex-1 min-h-screen relative">
        {/* Toggle Button */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDashboard(false)}
            className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            My Tasks
          </Button>
        </div>
        <CustomizableHomePage />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen relative">
      {/* Toggle Button */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDashboard(true)}
          className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>

      <div className="p-6">
        <MyWorkHeader
          view={view}
          onViewChange={setView}
          dateView={dateView}
          onDateViewChange={setDateView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewItem={handleNewItem}
        />

        {loading ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-16">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading your work...</span>
            </div>
          </div>
        ) : hasAssignments ? (
          <div>
            {view === 'table' && (
              <AssignedItemsTable 
                assignments={filteredAssignments}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                onStatusChange={handleStatusChange}
                onDateChange={handleDateChange}
                onItemDelete={handleItemDelete}
                onBulkAction={handleBulkAction}
                onAddItem={handleNewItem}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
            {view === 'calendar' && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-12 text-center">
                <p className="text-gray-600">
                  Calendar view coming soon...
                </p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState onHelp={handleHelp} />
        )}
      </div>
    </div>
  );
}