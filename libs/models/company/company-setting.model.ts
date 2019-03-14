export enum CompanySettingsEnum {
  SurveySearchIntegration = 'SurveySearchIntegration',
  PeerTermsAndConditionsRequested = 'PeerTermsAndConditionsRequested',
  PeerTermsAndConditionsAccepted = 'PeerTermsAndConditionsAccepted',
  RestrictSurveySearchCountryFilterToPayMarket = 'RestrictSurveySearchCountryFilterToPayMarket',
  MultiMatchSearchIntegration = 'MultiMatchSearchIntegration',
  AddJobsSearchIntegration = 'AddJobsSearchIntegration',
  UseUserRoleRestrictions = 'UseUserRoleRestrictions',
  CommunityReplyLimit = 'CommunityReplyLimit',
  MaxProjectJobCount = 'MaxProjectJobCount',
  ProjectJobCount = 'ProjectJobCount',
  CommunitySearchBar = 'CommunitySearchBar'
}

export interface CompanySetting {
  Key: CompanySettingsEnum;
  DisplayName: string;
  Value: string;
  Visible: boolean;
}

export function generateMockCompanySetting(): CompanySetting {
  return {
    Key: CompanySettingsEnum.PeerTermsAndConditionsRequested,
    DisplayName: 'Mock Company Setting',
    Value: 'true',
    Visible: true
  };
}
