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
  DataInsightsReportBuilder = 'DataInsightsReportBuilder',
  PeerExchangeExplorerEnabled = 'PeerExchangeExplorerEnabled',
  DataInsightsThumbnailsViewDisplay = 'DataInsightsThumbnailsViewDisplay',
  EnableLibraryForRoutedJobDescriptions = 'EnableLibraryForRoutedJobDescriptions',
  DataInsightsFormulaBuilder = 'DataInsightsFormulaBuilder',
  SessionTimeoutMinutes = 'SessionTimeoutMinutes',
  JDMCoreUseClient = 'JDMCoreUseClient',
  JDMSettingsUseClient = 'JDMSettingsUseClient',
  JDMTemplatesUseClient = 'JDMTemplatesUseClient',
  ManualOrgDataLoadLink = 'ManualOrgDataLoadLink',
  EnableJobsPageToggle = 'EnableJobsPageToggle',
  CanEditCurrentStructureRanges = 'CanEditCurrentStructureRanges',
  DashboardPreferences = 'DashboardPreferences',
  EnableJobRangeStructureRangeTypes = 'EnableJobRangeStructureRangeTypes',
  CommunityDisableAttachments = 'CommunityDisableAttachments',
  JDMExternalWorkflowsRequireSSOLogin = 'JDMExternalWorkflowsRequireSSOLogin',
  DefaultProjectDataSearchToPeerTab = 'DefaultProjectDataSearchToPeerTab',
  ParticipateInPeerDataExchange = 'ParticipateInPeerDataExchange',
  EnableEmployeeAcknowledgement = 'EnableEmployeeAcknowledgement',
  EnableWorkflowEmployeeResults = 'EnableWorkflowEmployeeResults',
  RestrictWorkflowToCompanyEmployeesOnly = 'RestrictWorkflowToCompanyEmployeesOnly',
  HideSecondarySurveyDataFields = 'HideSecondarySurveyDataFields',
  EnableIntervalAgingFactor = 'EnableIntervalAgingFactor',
  EnablePricingReview = 'EnablePricingReview',
  EnableLiveChat = 'EnableLiveChat'
}

export enum CustomCompanySettingsDisplayEnum {
  ParticipateInPeerDataExchange = 'Legal - Agreed to Normative Research',
  EnableLibraryForRoutedJobDescriptions = 'JDM - Enable Library for Routed Job Descriptions',
  EnableEmployeeAcknowledgement = 'JDM - Enable Employee Acknowledgement of Job Descriptions',
  EnableWorkflowEmployeeResults = 'JDM - Enable Employee Results in Workflow Setup',
  RestrictWorkflowToCompanyEmployeesOnly = 'JDM - Restrict Workflow to Company Employees Only',
  HideSecondarySurveyDataFields = 'Surveys - Disable Secondary Survey Fields',
  EnableIntervalAgingFactor = 'Pricings - Enable Effective Dated Aging',
  EnablePricingReview = 'Pricings - Enable Pricing Status Dropdown',
  EnableLiveChat = 'Other - Enable Live Chat'
}

export interface CompanySetting {
  Key: CompanySettingsEnum;
  DisplayName: string;
  Value: string;
  Visible: boolean;
  Disabled?: boolean;
  DataType: string;
}

export function generateMockCompanySetting(): CompanySetting {
  return {
    Key: CompanySettingsEnum.PeerTermsAndConditionsRequested,
    DisplayName: 'Mock Company Setting',
    Value: 'true',
    Visible: true,
    DataType: 'string'
  };
}
