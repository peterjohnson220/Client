export interface JobLevelOrder {
    JobLevel: string;
    Order: number;
}

export function generateMockJobLevelOrder(): JobLevelOrder {
  return {
    JobLevel: '',
    Order: 0
  };
}
