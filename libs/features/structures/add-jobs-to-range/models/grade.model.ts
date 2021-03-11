import { GradeJob } from './grade-job.model';

export interface Grade {
  CompanyStructuresRangesId: number;
  CompanyStructuresRangeGroupId: number;
  CompanyStructuresGradesId: number;
  GradeName: string;
  Min?: number;
  Mid?: number;
  Max?: number;
  Tertile_First?: number;
  Tertile_Second?: number;
  Quartile_First?: number;
  Quartile_Second?: number;
  Quintile_First?: number;
  Quintile_Second?: number;
  Quintile_Third?: number;
  Quintile_Fourth?: number;
  TotalJobs: number;
  LoadingJobs: boolean;
  LoadingJobsError: boolean;
  Jobs: GradeJob[];
}


export function generateMockGrade(): Grade {
  return {
    GradeName: 'fakeGrade',
    CompanyStructuresRangesId: 1,
    CompanyStructuresRangeGroupId: 1,
    CompanyStructuresGradesId: 1,
    Min: 1,
    Mid: 1,
    Max: 1,
    Tertile_First: 1,
    Tertile_Second: 1,
    Quartile_First: 1,
    Quartile_Second: 1,
    Quintile_First: 1,
    Quintile_Second: 1,
    Quintile_Third: 1,
    Quintile_Fourth: 1,
    TotalJobs: 1,
    LoadingJobs: false,
    LoadingJobsError: false,
    Jobs: []
  };
}
