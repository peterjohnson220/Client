import { Survey } from 'libs/models';

export interface GetCompanySurveysResponse {
  Surveys: Survey[];
  HasMoreData: boolean;
}
