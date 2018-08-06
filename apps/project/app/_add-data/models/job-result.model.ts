import {DataCut} from './data-cut.model';

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
    EffectiveDate: Date;
    Category?: string;
    FLSAStatus?: string;
    Scope?: string;
    LoadingDataCuts: boolean;
    DataCuts: DataCut[];
    CountryCode?: string;
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
    MatchCount: 5,
    EffectiveDate: new Date(2010, 3, 1),
    LoadingDataCuts: false,
    DataCuts: [],
    CountryCode: 'USA'
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
    Source: 'Payfactors',
    Description: `Job Summary: Prepares, analyzes, and reviews financial statements using accounting principles.
     Job Duties: Keeps records of account entries by compiling and analyzing accounting activities.
     Prepares reports such as balance sheets, profit and loss statements,
     and other documents that project the organization's financial position.
     Reviews financial statements for completeness, accuracy, and compliance.
     Oversees accounting operations, or a complex segment of the accounting function.
     Coordinates accounting matters with other departments. Experience and Education:
     Performs work under general supervision. Handles moderately complex issues and problems,
     and refers more complex issues to higher-level staff. Possesses solid working knowledge of subject matter.
     May provide leadership, coaching, and/or mentoring to a subordinate group.
     Typically requires a Bachelor's degree and 2 to 4 years of experience. May require a CPA.
     Reports to: Typically reports to a department head or manager. Competencies: Analytical skills.
     Problem-solving. Ability to work within a team.`,
    IsPayfactors: true,
    MatchCount: 0,
    EffectiveDate: new Date(2018, 6, 1),
    Category: 'Professional',
    FLSAStatus: 'Typically Exempt',
    Scope: 'Boston - MA',
    LoadingDataCuts: false,
    DataCuts: []
  };
}
