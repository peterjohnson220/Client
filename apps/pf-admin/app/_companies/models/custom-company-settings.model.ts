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

export function generateMockCustomCompanySetting(): CustomCompanySetting {
  return {
    Key: CompanySettingsEnum.ParticipateInPeerDataExchange,
    Value: true,
    DisplayName: CustomCompanySettingsDisplayEnum.ParticipateInPeerDataExchange,
    Index: 1,
    Type: CompanySettingsListType.Custom,
  };
}