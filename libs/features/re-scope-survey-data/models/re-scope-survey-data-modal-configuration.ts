import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReScopeSurveyDataModalConfiguration {
  SurveyJobId: number;
  SurveyDataId: number;
  SurveyJobTemplate: ElementRef;
  Rate: 'Annual' | 'Hourly';
  RowIndex: number; // used to prevent ExpressionChangedAfterItHasBeenCheckedError by only opening the modal for the currently clicked row
  ShowPricingWarning: boolean;
  EntityId: number; // This could be either the PricingMatchId or the ProjectJobMatchId
}
