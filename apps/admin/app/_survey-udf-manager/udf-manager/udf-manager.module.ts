import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { reducers } from './reducers';
import { UdfManagerEffects } from './effects/udf-manager.effects';
import { UdfPickerComponent } from './components/udf-picker/udf-picker.component';
import { CompanySearcherComponent } from './components/company-searcher/company-searcher.component';
import { UdfManagerPageComponent } from './udf-manager.page';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('surveyUdfManager', reducers),
    EffectsModule.forFeature([
      UdfManagerEffects,
    ]),
    FontAwesomeModule,

    // Payfactors
    PfFormsModule,
    PfCommonUIModule,
    DropDownsModule,
    NumericTextBoxModule,

  ],
  declarations: [
    // Pages
    UdfManagerPageComponent,

    // Components
    CompanySearcherComponent,
    UdfPickerComponent,
  ],
  exports: [
    UdfManagerPageComponent
  ]
})
export class UdfManagerModule {
  constructor() { }
}
