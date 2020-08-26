import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReScopeSurveyDataModalConfiguration {
  SurveyJobId: number;
  SurveyDataId: number;
  SurveyJobTemplate: ElementRef<any>;
  ShowModal$: Observable<boolean>;
  Rate: 'Annual' | 'Hourly';
  ShowPricingWarning: boolean;
}
