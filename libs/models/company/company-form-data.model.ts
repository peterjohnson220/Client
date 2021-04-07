export interface CompanyFormData {
  CompanyId: number;
  CompanyName: string;
  CompanyNameShort: string;
  City: string;
  State: string;
  Zip: string;
  Status: string;
  Website: string;
  Domain: string;
  AccountExecutiveUserId?: string;
  PrimarySupportUserId?: string;
  JDMSeniorAssociateUserId?: string;
  SystemUserGroupsId: number;
  ClientType: string;
  Industry: string;
  PeerIndustry: string;
  FTEs?: string;
  Assets?: string;
  Revenue?: string;
  UserIdToTableau: number;
  EnablePricingReview: boolean;
  CompanyLogo: string;
  CustomerSuccessMgrUserId?: string;
  DataInsightsAssociateUserId?: number;
  ParticipateInPeerDataExchange: boolean;
  EnableWebLogin: boolean;
  EnableLibraryForRoutedJobDescriptions: boolean;
  EnableEmployeeAcknowledgement: boolean;
  EnableWorkflowEmployeeResults: boolean;
  RestrictWorkflowToCompanyEmployeesOnly: boolean;
  CustomFieldName: string;
  CustomFieldValue: string;
  HideSecondarySurveyDataFields: boolean;
  EnableLiveChat: boolean;
  EnableIntervalAgingFactor: boolean;
  PasswordLengthRequirement: number;
  GroupName?: string;
  CompanyColor: string;
  OrgDataAutoloaderApiKey: string;
  CompanyDescription: string;
}
