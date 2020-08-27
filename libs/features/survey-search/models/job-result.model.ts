import { SurveySearchResultDataSources } from 'libs/constants';

import { DataCut } from './data-cut.model';

export interface BaseJobInfo {
  Id: number;
  Title: string;
  Code: string;
  Description: string;
  Family: string;
  Level: string;
  TotalDataCuts?: number;
  LoadingDataCuts: boolean;
  LoadingDataCutsError: boolean;
}

export interface PeerJobInfo {
  Id: string;
  ExchangeId: number;
  ExchangeJobId: number;
  NatAvgOrgs: number;
  NatAvgBase50th: number;
  NatAvgTCC50th: number;
}

export interface JobResult extends BaseJobInfo {
    SurveyName: string;
    DataSource: SurveySearchResultDataSources;
    Source: string;
    Matches: number;
    EffectiveDate: Date;
    Category?: string;
    FLSAStatus?: string;
    Scope?: string;
    LoadingMoreDataCuts: boolean;
    Incs: number;
    Orgs: number;
    Base50th: number;
    TCC50th: number;
    CountryCode?: string;
    IsSelected: boolean;
    EEO: string;
    DataCuts: DataCut[];
    PeerJobInfo?: PeerJobInfo;
}

export function generateMockSurveyJobResult(): JobResult {
  return {
    Id: 100,
    DataSource: SurveySearchResultDataSources.Surveys,
    Title: 'Blend of Gas Operations Top Executive-Corporate, G',
    Code: '13001',
    SurveyName: 'TCM Executive Long Term Incentives Total Compensation by Industry',
    Family: 'Accounting',
    Level: 'I',
    Source: 'Hewitt Associates',
    Description: 'Job Description: Accountant',
    Matches: 5,
    EffectiveDate: new Date(2010, 3, 1),
    LoadingDataCuts: false,
    LoadingMoreDataCuts: false,
    DataCuts: [],
    Base50th: 1,
    TCC50th: 1,
    Incs: 25,
    Orgs: 5,
    CountryCode: 'USA',
    IsSelected: false,
    EEO: null,
    LoadingDataCutsError: false
  };
}

export function generateMockPayfactorsJobResult(): JobResult {
  return {
    Id: 101,
    DataSource: SurveySearchResultDataSources.Payfactors,
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
    Matches: 0,
    EffectiveDate: new Date(2018, 6, 1),
    Category: 'Professional',
    FLSAStatus: 'Typically Exempt',
    Scope: 'Boston - MA',
    LoadingDataCuts: false,
    LoadingMoreDataCuts: false,
    DataCuts: [],
    Base50th: 1,
    TCC50th: 1,
    Incs: 10,
    Orgs: 5,
    CountryCode: 'USA',
    IsSelected: false,
    EEO: 'Yes',
    LoadingDataCutsError: false
  };
}
