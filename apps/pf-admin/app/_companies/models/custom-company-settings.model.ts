import { CompanySettingsEnum, CustomCompanySettingsDisplayEnum } from 'libs/models';
import { CompanySettingsListType } from '../constants/settings-constants';

export interface CustomCompanySettings {
  EnablePricingReview: boolean;
  ParticipateInPeerDataExchange: boolean;
  EnableLibraryForRoutedJobDescriptions: boolean;
  EnableEmployeeAcknowledgement: boolean;
  EnableWorkflowEmployeeResults: boolean;
  RestrictWorkflowToCompanyEmployeesOnly: boolean;
  HideSecondarySurveyDataFields: boolean;
  EnableLiveChat: boolean;
  EnableIntervalAgingFactor: boolean;
}

export interface CustomCompanySetting {
  Key: string;
  Value: boolean;
  DisplayName: string;
  Index: number;
  Type: string;
}

export function generateMockCustomCompanySettingsWithDefaults(): CustomCompanySettings {
  return {
    EnablePricingReview: false,
    ParticipateInPeerDataExchange: true,
    EnableLibraryForRoutedJobDescriptions: true,
    EnableEmployeeAcknowledgement: false,
    EnableWorkflowEmployeeResults: false,
    RestrictWorkflowToCompanyEmployeesOnly: false,
    HideSecondarySurveyDataFields: true,
    EnableLiveChat: false,
    EnableIntervalAgingFactor: false
  };
}


export function generateMockCustomCompanySetting(): CustomCompanySetting[] {
  return [{
    Key: CompanySettingsEnum.ParticipateInPeerDataExchange,
    Value: true,
    DisplayName: CustomCompanySettingsDisplayEnum.ParticipateInPeerDataExchange,
    Index: 0,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.EnableLibraryForRoutedJobDescriptions,
    Value: true,
    DisplayName: CustomCompanySettingsDisplayEnum.EnableLibraryForRoutedJobDescriptions,
    Index: 7,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.EnableEmployeeAcknowledgement,
    Value: false,
    DisplayName: CustomCompanySettingsDisplayEnum.EnableEmployeeAcknowledgement,
    Index: 8,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.EnableWorkflowEmployeeResults,
    Value: false,
    DisplayName: CustomCompanySettingsDisplayEnum.EnableWorkflowEmployeeResults,
    Index: 9,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.RestrictWorkflowToCompanyEmployeesOnly,
    Value: false,
    DisplayName: CustomCompanySettingsDisplayEnum.RestrictWorkflowToCompanyEmployeesOnly,
    Index: 10,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.HideSecondarySurveyDataFields,
    Value: true,
    DisplayName: CustomCompanySettingsDisplayEnum.HideSecondarySurveyDataFields,
    Index: 12,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.EnableIntervalAgingFactor,
    Value: false,
    DisplayName: CustomCompanySettingsDisplayEnum.EnableIntervalAgingFactor,
    Index: 15,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.EnablePricingReview,
    Value: false,
    DisplayName: CustomCompanySettingsDisplayEnum.EnablePricingReview,
    Index: 16,
    Type: CompanySettingsListType.Custom
  },
  {
    Key: CompanySettingsEnum.EnableLiveChat,
    Value: false,
    DisplayName: CustomCompanySettingsDisplayEnum.EnableLiveChat,
    Index: 19,
    Type: CompanySettingsListType.Custom
  }];
}
