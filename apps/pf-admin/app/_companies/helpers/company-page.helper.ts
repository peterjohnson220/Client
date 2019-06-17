import { CompanyFormData, CompanySetting } from 'libs/models/company';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings';
import { CustomCompanySettings } from '../models';

export class CompanyPageHelper {
  static buildAddNewCompanyFormData(systemUserGroupsId: number): CompanyFormData {
    return {
      CompanyId: -1,
      CompanyName: '',
      CompanyNameShort: '',
      Status: 'Active',
      PrimarySupportUserId: null,
      SystemUserGroupsId: systemUserGroupsId,
      ClientType: '',
      Industry: '',
      FTEs: null,
      Assets: null,
      Revenue: null,
      EnablePricingReview: false,
      CompanyLogo: '',
      CustomerSuccessMgrUserId: null,
      ParticipateInPeerDataExchange: true,
      EnableLibraryForRoutedJobDescriptions: true,
      EnableEmployeeAcknowledgement: false,
      EnableWorkflowEmployeeResults: false,
      RestrictWorkflowToCompanyEmployeesOnly: false,
      CustomFieldName: '',
      CustomFieldValue: '',
      HideSecondarySurveyDataFields: true,
      EnableLiveChat: false,
      EnableIntervalAgingFactor: false,
      PasswordLengthRequirement: 8,
      OrgDataAutoloaderApiKey: null,
      GroupName: null
    };
  }

  static buildCompanySettingsSaveRequest(companyId: number, settings: CompanySetting[]): CompanySettingsSaveRequest {
    return {
      CompanyId: companyId,
      Settings: settings.map(s => ({ Name: s.Key.toString(), Value: s.Value }))
    };
  }

  static buildDefaultCustomCompanySettings(): CustomCompanySettings {
    return {
      EnablePricingReview: false,
      ParticipateInPeerDataExchange: true,
      EnableLibraryForRoutedJobDescriptions: true,
      EnableEmployeeAcknowledgement: false,
      EnableWorkflowEmployeeResults: false,
      RestrictWorkflowToCompanyEmployeesOnly: false,
      HideSecondarySurveyDataFields: true,
      EnableLiveChat: false,
      EnableIntervalAgingFactor: false,
    };
  }

}
