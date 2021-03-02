import { Company } from './company.model';

export interface CompanyDto extends Company {
  AccountExecutiveUserId: number;
  PrimarySupportUserId: number;
  JDMSeniorAssociateUserId: number;
  SystemUserGroupsId: number;
  ClientType: string;
  Industry: string;
  PeerIndustry: string;
  City: string;
  State: string;
  Zip: string;
  FTEs: number;
  Assets: number;
  Revenue: number;
  EnablePricingReview: boolean;
  CompanyLogo: string;
  CustomerSuccessMgrUserId: number;
  UserIdToTableau: number;
  ParticipateInPeerDataExchange: boolean;
  EnableLibraryForRoutedJobDescriptions: boolean;
  EnableEmployeeAcknowledgement: boolean;
  CustomFieldName: string;
  CustomFieldValue: string;
  ExternalId: string;
  PublicToken: string;
  EnableWebLogin: boolean;
  EnableWorkflowEmployeeResults: boolean;
  HideSecondarySurveyDataFields: boolean;
  EnableLiveChat: boolean;
  RestrictWorkflowToCompanyEmployeesOnly: boolean;
  GroupName: string;
  EnableIntervalAgingFactor: boolean;
  CreateUser: number;
  CreateDate: Date;
  EditUser: number;
  EditDate: Date;
  PasswordLengthRequirement: number;
  DataInsightsAssociateUserId: number;
  Website: string;
  Domain: string;
  CompanyColor: string;
  OrgDataAutoloaderApiKey: string;
  CompanyDescription: string;
}
