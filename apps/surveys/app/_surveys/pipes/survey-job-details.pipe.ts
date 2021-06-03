import { Pipe, PipeTransform } from '@angular/core';

import { SurveyJobDetails } from 'libs/models/survey';

@Pipe({
  name: 'surveyJobDetails'
})
export class SurveyJobDetailsPipe implements PipeTransform {
  transform(SurveyDataRow: any): SurveyJobDetails {
    return {
      SurveyJobId: SurveyDataRow['SurveyJob_Survey_Job_ID'],
      JobDescription: SurveyDataRow['SurveyJob_Job_Description'],
      JobFamily: SurveyDataRow['SurveyJob_Job_Family'],
      LevelCode: SurveyDataRow['SurveyJob_Level_Code']
    };
  }
}
