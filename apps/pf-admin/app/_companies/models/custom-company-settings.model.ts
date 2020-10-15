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
