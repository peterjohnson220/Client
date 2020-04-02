import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { EffectsModule } from '@ngrx/effects';

import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { PfFormsModule } from 'libs/forms';

import { GridContextComponent, ModelSettingsBtnComponent } from './components';
import { ModelGridComponent, ModelSettingsModalComponent } from './containers';
import { ModelSettingsModalEffects } from './effects/model-settings-modal.effects';
import { reducers } from './reducers';
import { RangeValuePipe } from './pipes';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // 3rd Party
    StoreModule.forFeature('structures_jobBasedRange_shared', reducers),
    EffectsModule.forFeature([ModelSettingsModalEffects]),
    FontAwesomeModule,
    NgbTabsetModule,
    AutoCompleteModule,
    ComboBoxModule,

    // Payfactors
    PfDataGridModule,
    PfFormsModule,
    NumericTextBoxModule,
    DropDownListModule,
    ReactiveFormsModule
  ],
  declarations: [
    ModelGridComponent,
    GridContextComponent,
    ModelSettingsModalComponent,
    ModelSettingsBtnComponent,
    RangeValuePipe,
  ],
  exports: [
    ModelGridComponent,
    GridContextComponent,
    ModelSettingsModalComponent,
    ModelSettingsBtnComponent,
    FontAwesomeModule
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
