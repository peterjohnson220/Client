export interface SurveyInfoByCompanyDto {
  SurveyId: number;
  SurveyPublisher: string;
  SurveyTitle: string;
  ParticipationFileName: string;
  UploadingFileError?: string;
  Saving?: boolean;
  SavingError?: string;
  SavingSuccess?: boolean;
}
