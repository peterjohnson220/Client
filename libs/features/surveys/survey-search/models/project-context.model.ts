export interface ProjectContext {
  ProjectId: number;
  JobValues: string[];
  RestrictToCountryCode: boolean;
  SearchContext: { PayMarketId: number };
}

export function generateProjectContext(): ProjectContext {
  return {
    ProjectId: 1234,
    JobValues: ['1', 'A123'],
    RestrictToCountryCode : false,
    SearchContext: {PayMarketId: 0}
  };
}
