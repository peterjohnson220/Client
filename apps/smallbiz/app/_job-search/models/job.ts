export interface Job {
  id: number;
  title: string;
  description: string;
  code: string;
  family: string;
  level: string;
  effectiveDate: Date;
  nationalBaseAverage: number;
  nationalBase25: number;
  nationalBase50: number;
  nationalBase75: number;
  nationalTccAverage: number;
  nationalTcc25: number;
  nationalTcc50: number;
  nationalTcc75: number;
}

export function createMockJob(
  id = 1,
  title = 'Zookeeper',
  description = 'maintains the zoo',
  code = 'abc123',
  family = 'Zoo'
): Job {
  return {
    id,
    title,
    description,
    code,
    family,
    level: 'IV',
    effectiveDate: new Date(),
    nationalBaseAverage: 100000,
    nationalBase25: 110000,
    nationalBase50: 120000,
    nationalBase75: 130000,
    nationalTccAverage: 140000,
    nationalTcc25: 150000,
    nationalTcc50: 160000,
    nationalTcc75: 170000,
  };
}
