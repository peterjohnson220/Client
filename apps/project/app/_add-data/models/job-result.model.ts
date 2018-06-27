export interface JobResult {
    Id: number;
    Title: string;
    Code: string;
    SurveyName: string ;
    Family: string;
    Level: string;
    Source: string;
    Description: string;
    IsPayfactors: boolean;
    MatchCount: number;
}

export function generateMockSurveyJobResult(): JobResult {
  return {
    Id: 100,
    Title: 'Blend of Gas Operations Top Executive-Corporate, G',
    Code: '13001',
    SurveyName: 'TCM Executive Long Term Incentives Total Compensation by Industry',
    Family: 'Accounting',
    Level: 'I',
    Source: 'Hewitt Associates',
    Description: 'Job Description: Accountant',
    IsPayfactors: false,
    MatchCount: 5
  };
}

export function generateMockPayfactorsJobResult(): JobResult {
  return {
    Id: 101,
    Title: 'Accountant II',
    Code: '1002',
    SurveyName: 'PayFactors',
    Family: 'Accounting',
    Level: 'I',
    Source: 'Payfactors effective date June 1, 2018',
    Description: 'Job Description: Accountant',
    IsPayfactors: true,
    MatchCount: 0
  };
}
