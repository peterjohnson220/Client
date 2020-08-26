import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from '../../core';
import { PfCommonUIModule } from '../../ui/common';
import { PfFormsModule } from '../../forms';
import { PfDataGridModule } from '../pf-data-grid/pf-data-grid.module';

import { ReScopeSurveyDataComponent } from './re-scope-survey-data/re-scope-survey-data.component';
import { reducers } from './reducers';
import { ReScopeSurveyDataEffects } from './effects';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    CommonModule,
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    StoreModule.forFeature('feature_reScopeSurveyData', reducers),
    EffectsModule.forFeature([ReScopeSurveyDataEffects]),
    FontAwesomeModule
  ],
  declarations: [ReScopeSurveyDataComponent],
  exports: [ReScopeSurveyDataComponent]
})
export class ReScopeSurveyDataModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
