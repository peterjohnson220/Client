export interface DefaultScope {
  Survey: CompanySurvey;
  Scope: CombinedScope;
}

export interface CompanySurvey {
  Id: number;
  Title: string;
  Publisher: string;
  EffectiveDate: Date;
  DisplayName: string;
}

export interface CombinedScope {
  Name: string;
  Value: string;
}
