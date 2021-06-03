export interface SurveyInfoByCompanyDto {
  SurveyId: number;
  SurveyPublisher: string;
  SurveyName: string;
  ParticipationFileName: string;
  UploadingFileError?: string;
  Saving?: boolean;
  SavingError?: string;
  SavingSuccess?: boolean;
}
