export interface JobResult {
    Id: number;
    Title: string;
    SurveyName: string;
    Family: string;
    Level: string;
    Source: string;
    Description: string;
    IsPayfactors: boolean;
}

export const mockSurveyJob: JobResult = {
  Id: 100,
  Title: 'Accountant I',
  SurveyName: 'AHON - Accounting and Finance',
  Family: 'Accounting',
  Level: 'I',
  Source: 'American Society for Healthcare Human Resources - National Healthcare Staff Compensation Survey',
  Description: 'Job Description: Accountant',
  IsPayfactors: false
};

export const mockPayfactorsJob: JobResult = {
  Id: 101,
  Title: 'Accountant II',
  SurveyName: 'PayFactors',
  Family: 'Accounting',
  Level: 'I',
  Source: 'Payfactors effective date June 1, 2018',
  Description: 'Job Description: Accountant',
  IsPayfactors: true
};
