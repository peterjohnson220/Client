export enum CompanySettingsEnum {
  SurveySearchIntegration = 'SurveySearchIntegration',
  PeerTermsAndConditionsRequested = 'PeerTermsAndConditionsRequested',
  PeerTermsAndConditionsHardCopyRequested = 'PeerTermsAndConditionsHardCopyRequested',
  PeerTermsAndConditionsAccepted = 'PeerTermsAndConditionsAccepted',
  PeerManageShowCompanyJobs = 'PeerManageShowCompanyJobs',
  RestrictSurveySearchCountryFilterToPayMarket = 'RestrictSurveySearchCountryFilterToPayMarket',
  MultiMatchSearchIntegration = 'MultiMatchSearchIntegration',
  AddJobsSearchIntegration = 'AddJobsSearchIntegration',
  UseUserRoleRestrictions = 'UseUserRoleRestrictions',
  CommunityReplyLimit = 'CommunityReplyLimit',
  MaxProjectJobCount = 'MaxProjectJobCount',
  ProjectJobCount = 'ProjectJobCount',
  PasswordExpirationEnabled = 'PasswordExpirationEnabled',
  PasswordHistoryEnabled = 'PasswordHistoryEnabled',
  PasswordExpirationDays = 'PasswordExpirationDays',
  PasswordHistoryNumber = 'PasswordHistoryNumber',
  DataInsightsReportBuilder = 'DataInsightsReportBuilder'
}

export interface CompanySetting {
  Key: CompanySettingsEnum;
  DisplayName: string;
  Value: string;
  Visible: boolean;
  Disabled?: boolean;
}

export function generateMockCompanySetting(): CompanySetting {
  return {
    Key: CompanySettingsEnum.PeerTermsAndConditionsRequested,
    DisplayName: 'Mock Company Setting',
    Value: 'true',
    Visible: true
  };
}
