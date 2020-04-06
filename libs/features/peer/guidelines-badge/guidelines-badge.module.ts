import { NgModule } from '@angular/core';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';

import {reducers} from './reducers';
import {GuidelinesBadgeComponent} from './components/guidelines-badge';

@NgModule({
  declarations: [GuidelinesBadgeComponent],
  imports: [
    FontAwesomeModule,
    NgbPopoverModule,
    CommonModule,
    StoreModule.forFeature('dataCutValidation', reducers)
  ],
  exports: [GuidelinesBadgeComponent]
})
export class GuidelinesBadgeModule {}
