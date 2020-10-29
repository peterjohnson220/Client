import { JobLevelOrder, generateMockJobLevelOrder } from './job-level-order.model';

export interface JobLevelHierarchy {
  Id: number;
  Name: string;
}

export function generateMockJobLevelHierarchy(): JobLevelHierarchy {
  return {
    Id: 1,
    Name: 'Test HierarchyName'
  };
}

export interface JobLevelHierarchyDetail {
    HierarchyId: number;
    HierarchyName: string;
    GroupingOrder: string;
    JobFamilies: string[];
    JobLevel: JobLevelOrder[];
    Created: boolean;
}

export function generateMockJobLevelHierarchyDetail(): JobLevelHierarchyDetail {
  return {
    HierarchyId: 0,
    HierarchyName: '',
    GroupingOrder: '',
    JobFamilies: [''],
    JobLevel: [generateMockJobLevelOrder()],
    Created: false
  };
}
