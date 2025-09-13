import { 
  FlexiBoard, 
  FlexiBoardColumn, 
  BusinessAppType, 
  MissionTemplate 
} from '../types/flexiboard';

export interface BoardMorphConfig {
  preserveData?: boolean;
  autoMigrate?: boolean;
  customMapping?: Record<string, string>;
}

export class BoardMorphingEngine {
  private board: FlexiBoard;

  constructor(board: FlexiBoard) {
    this.board = board;
  }

  // Morph board to different business applications
  morphToBusinessApp(appType: BusinessAppType, config: BoardMorphConfig = {}): FlexiBoard {
    const template = this.getBusinessAppTemplate(appType);
    
    if (config.preserveData) {
      return this.morphWithDataPreservation(template, config);
    } else {
      return this.morphWithTemplate(template);
    }
  }

  // Get predefined templates for business applications
  private getBusinessAppTemplate(appType: BusinessAppType): Partial<FlexiBoard> {
    const templates: Record<BusinessAppType, Partial<FlexiBoard>> = {
      'tokenization': this.getTokenizationTemplate(),
      'due-diligence': this.getDueDiligenceTemplate(),
      'partnership': this.getPartnershipTemplate(),
      'ipo': this.getIPOTemplate(),
      'campaign': this.getCampaignTemplate(),
      'relationship': this.getRelationshipTemplate(),
      'event': this.getEventTemplate(),
      'compliance': this.getComplianceTemplate(),
      'filing': this.getFilingTemplate(),
      'audit': this.getAuditTemplate(),
      'content': this.getContentTemplate(),
      'brand-voice': this.getBrandVoiceTemplate(),
      'content-planning': this.getContentPlanningTemplate(),
      'focus': this.getFocusTemplate(),
      'wellness': this.getWellnessTemplate(),
      'knowledge': this.getKnowledgeTemplate(),
    };

    return templates[appType];
  }

  // Company Management Templates
  private getTokenizationTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Company Tokenization Board',
      businessApp: 'tokenization',
      columns: [
        { id: 'company', title: 'Company', type: 'text', required: true },
        { id: 'stage', title: 'Tokenization Stage', type: 'status', options: [
          'Due Diligence', 'Legal Review', 'Token Structure', 'Smart Contract', 
          'Regulatory Approval', 'Marketing', 'Launch', 'Post-Launch'
        ]},
        { id: 'priority', title: 'Priority', type: 'priority' },
        { id: 'lead', title: 'Lead Advisor', type: 'person' },
        { id: 'deadline', title: 'Target Date', type: 'date' },
        { id: 'valuation', title: 'Valuation', type: 'currency' },
        { id: 'progress', title: 'Progress', type: 'progress' },
        { id: 'documents', title: 'Documents', type: 'file' },
        { id: 'notes', title: 'Notes', type: 'text' },
      ],
      views: [
        {
          id: 'kanban-view',
          name: 'Tokenization Pipeline',
          type: 'kanban',
          isDefault: true,
          filters: [],
          sorts: [{ column: 'deadline', direction: 'asc' }],
          groupBy: 'stage',
        },
        {
          id: 'timeline-view',
          name: 'Timeline View',
          type: 'timeline',
          filters: [],
          sorts: [{ column: 'deadline', direction: 'asc' }],
        },
      ],
    };
  }

  private getDueDiligenceTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Due Diligence Board',
      businessApp: 'due-diligence',
      columns: [
        { id: 'item', title: 'Due Diligence Item', type: 'text', required: true },
        { id: 'category', title: 'Category', type: 'status', options: [
          'Financial', 'Legal', 'Operational', 'Technical', 'Market', 'Regulatory'
        ]},
        { id: 'status', title: 'Status', type: 'status', options: [
          'Not Started', 'In Progress', 'Under Review', 'Approved', 'Rejected'
        ]},
        { id: 'assignee', title: 'Assignee', type: 'person' },
        { id: 'due_date', title: 'Due Date', type: 'date' },
        { id: 'risk_level', title: 'Risk Level', type: 'priority' },
        { id: 'documents', title: 'Evidence', type: 'file' },
        { id: 'comments', title: 'Comments', type: 'text' },
      ],
    };
  }

  // Investor Relations Templates
  private getCampaignTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Investor Campaign Board',
      businessApp: 'campaign',
      columns: [
        { id: 'campaign', title: 'Campaign Name', type: 'text', required: true },
        { id: 'type', title: 'Campaign Type', type: 'status', options: [
          'Seed Round', 'Series A', 'Series B', 'Bridge', 'Token Sale', 'IPO'
        ]},
        { id: 'status', title: 'Status', type: 'status', options: [
          'Planning', 'Active', 'Follow-up', 'Closed Won', 'Closed Lost'
        ]},
        { id: 'target_amount', title: 'Target Amount', type: 'currency' },
        { id: 'raised_amount', title: 'Raised Amount', type: 'currency' },
        { id: 'progress', title: 'Progress', type: 'progress' },
        { id: 'lead_investor', title: 'Lead Investor', type: 'person' },
        { id: 'close_date', title: 'Target Close', type: 'date' },
        { id: 'materials', title: 'Materials', type: 'file' },
      ],
    };
  }

  // Compliance Templates
  private getComplianceTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Compliance Management Board',
      businessApp: 'compliance',
      columns: [
        { id: 'requirement', title: 'Compliance Requirement', type: 'text', required: true },
        { id: 'regulation', title: 'Regulation', type: 'status', options: [
          'SEC', 'FINRA', 'CFTC', 'State', 'International', 'Internal'
        ]},
        { id: 'status', title: 'Status', type: 'status', options: [
          'Not Started', 'In Progress', 'Under Review', 'Compliant', 'Non-Compliant'
        ]},
        { id: 'priority', title: 'Priority', type: 'priority' },
        { id: 'owner', title: 'Compliance Owner', type: 'person' },
        { id: 'due_date', title: 'Deadline', type: 'date' },
        { id: 'risk_rating', title: 'Risk Rating', type: 'rating' },
        { id: 'evidence', title: 'Evidence', type: 'file' },
        { id: 'notes', title: 'Notes', type: 'text' },
      ],
    };
  }

  // Content Studio Templates
  private getContentTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Content Creation Board',
      businessApp: 'content',
      columns: [
        { id: 'title', title: 'Content Title', type: 'text', required: true },
        { id: 'type', title: 'Content Type', type: 'status', options: [
          'Blog Post', 'Video', 'Podcast', 'Infographic', 'Whitepaper', 'Social Media', 'Email'
        ]},
        { id: 'status', title: 'Status', type: 'status', options: [
          'Ideation', 'Outline', 'Draft', 'Review', 'Editing', 'Approved', 'Published'
        ]},
        { id: 'author', title: 'Author', type: 'person' },
        { id: 'reviewer', title: 'Reviewer', type: 'person' },
        { id: 'publish_date', title: 'Publish Date', type: 'date' },
        { id: 'channel', title: 'Channel', type: 'tags' },
        { id: 'assets', title: 'Assets', type: 'file' },
        { id: 'seo_keywords', title: 'SEO Keywords', type: 'tags' },
      ],
    };
  }

  // Staff Productivity Templates
  private getFocusTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Focus & Productivity Board',
      businessApp: 'focus',
      columns: [
        { id: 'task', title: 'Task', type: 'text', required: true },
        { id: 'category', title: 'Category', type: 'status', options: [
          'Deep Work', 'Meetings', 'Admin', 'Learning', 'Creative', 'Planning'
        ]},
        { id: 'status', title: 'Status', type: 'status', options: [
          'Backlog', 'Today', 'In Progress', 'Blocked', 'Done'
        ]},
        { id: 'priority', title: 'Priority', type: 'priority' },
        { id: 'estimated_time', title: 'Estimated Time', type: 'number' },
        { id: 'actual_time', title: 'Actual Time', type: 'number' },
        { id: 'energy_level', title: 'Required Energy', type: 'status', options: [
          'Low', 'Medium', 'High'
        ]},
        { id: 'due_date', title: 'Due Date', type: 'date' },
        { id: 'notes', title: 'Notes', type: 'text' },
      ],
    };
  }

  private getKnowledgeTemplate(): Partial<FlexiBoard> {
    return {
      name: 'Knowledge Management Board',
      businessApp: 'knowledge',
      columns: [
        { id: 'topic', title: 'Knowledge Topic', type: 'text', required: true },
        { id: 'type', title: 'Type', type: 'status', options: [
          'Documentation', 'Best Practice', 'Process', 'Template', 'Training', 'Reference'
        ]},
        { id: 'status', title: 'Status', type: 'status', options: [
          'Draft', 'Review', 'Approved', 'Published', 'Outdated'
        ]},
        { id: 'owner', title: 'Owner', type: 'person' },
        { id: 'category', title: 'Category', type: 'tags' },
        { id: 'last_updated', title: 'Last Updated', type: 'date' },
        { id: 'access_level', title: 'Access Level', type: 'status', options: [
          'Public', 'Internal', 'Restricted', 'Confidential'
        ]},
        { id: 'documents', title: 'Documents', type: 'file' },
        { id: 'tags', title: 'Tags', type: 'tags' },
      ],
    };
  }

  // Additional templates for other business apps...
  private getPartnershipTemplate(): Partial<FlexiBoard> {
    return { name: 'Partnership Board', businessApp: 'partnership', columns: [], views: [] };
  }

  private getIPOTemplate(): Partial<FlexiBoard> {
    return { name: 'IPO Board', businessApp: 'ipo', columns: [], views: [] };
  }

  private getRelationshipTemplate(): Partial<FlexiBoard> {
    return { name: 'Relationship Board', businessApp: 'relationship', columns: [], views: [] };
  }

  private getEventTemplate(): Partial<FlexiBoard> {
    return { name: 'Event Board', businessApp: 'event', columns: [], views: [] };
  }

  private getFilingTemplate(): Partial<FlexiBoard> {
    return { name: 'Filing Board', businessApp: 'filing', columns: [], views: [] };
  }

  private getAuditTemplate(): Partial<FlexiBoard> {
    return { name: 'Audit Board', businessApp: 'audit', columns: [], views: [] };
  }

  private getBrandVoiceTemplate(): Partial<FlexiBoard> {
    return { name: 'Brand Voice Board', businessApp: 'brand-voice', columns: [], views: [] };
  }

  private getContentPlanningTemplate(): Partial<FlexiBoard> {
    return { name: 'Content Planning Board', businessApp: 'content-planning', columns: [], views: [] };
  }

  private getWellnessTemplate(): Partial<FlexiBoard> {
    return { name: 'Wellness Board', businessApp: 'wellness', columns: [], views: [] };
  }

  // Morphing implementations
  private morphWithTemplate(template: Partial<FlexiBoard>): FlexiBoard {
    return {
      ...this.board,
      ...template,
      id: this.board.id,
      ownerId: this.board.ownerId,
      workspace: this.board.workspace,
      updatedAt: new Date(),
    } as FlexiBoard;
  }

  private morphWithDataPreservation(
    template: Partial<FlexiBoard>, 
    config: BoardMorphConfig
  ): FlexiBoard {
    const newBoard = this.morphWithTemplate(template);
    
    // Map existing data to new structure
    if (config.customMapping) {
      newBoard.items = this.board.items.map(item => ({
        ...item,
        data: this.mapItemData(item.data, config.customMapping!),
      }));
    }
    
    return newBoard;
  }

  private mapItemData(
    oldData: Record<string, any>, 
    mapping: Record<string, string>
  ): Record<string, any> {
    const newData: Record<string, any> = {};
    
    Object.entries(mapping).forEach(([oldColumn, newColumn]) => {
      if (oldData[oldColumn] !== undefined) {
        newData[newColumn] = oldData[oldColumn];
      }
    });
    
    return newData;
  }

  // Quick morph methods for common transformations
  morphToTokenization(): FlexiBoard {
    return this.morphToBusinessApp('tokenization');
  }

  morphToCompliance(): FlexiBoard {
    return this.morphToBusinessApp('compliance');
  }

  morphToContent(): FlexiBoard {
    return this.morphToBusinessApp('content');
  }

  morphToCampaign(): FlexiBoard {
    return this.morphToBusinessApp('campaign');
  }

  morphToFocus(): FlexiBoard {
    return this.morphToBusinessApp('focus');
  }
}