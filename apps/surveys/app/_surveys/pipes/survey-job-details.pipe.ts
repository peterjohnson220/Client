import { Pipe, PipeTransform } from '@angular/core';

import { SurveyJobDetails } from '../models';

@Pipe({
  name: 'surveyJobDetails'
})
export class SurveyJobDetailsPipe implements PipeTransform {
  transform(SurveyDataRow: any): SurveyJobDetails {
    return {
      JobDescription: SurveyDataRow['SurveyJob_Job_Description'],
      JobFamily: SurveyDataRow['SurveyJob_Job_Family'],
      LevelCode: SurveyDataRow['SurveyJob_Level_Code']
    };
  }
}
