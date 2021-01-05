import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReScopeSurveyDataModalConfiguration {
  SurveyJobId: number;
  SurveyDataId: number;
  SurveyJobTemplate: ElementRef<any>;
  ShowModal$: Observable<boolean>;
  Rate: 'Annual' | 'Hourly';
  ShowPricingWarning: boolean;
  EntityId: number; // This could be either the PricingMatchId or the ProjectJobMatchId
}
