import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { NgbTabsetModule, NgbTooltipModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { EffectsModule } from '@ngrx/effects';

import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { PfFormsModule } from 'libs/forms';
import { RangeEditorModule } from 'libs/features/structures';
import { PfCommonUIModule } from 'libs/ui/common';

import { GlobalActionsComponent, GridContextComponent, ModelSettingsBtnComponent } from './components';
import {
  ModelGridComponent,
  ModelSettingsModalComponent,
  RangeRoundingComponent,
  RangeDistributionSettingComponent,
  DuplicateModelModalComponent
} from './containers';
import { ModelSettingsModalEffects, PublishModelModalEffects, SharedEffects, DuplicateModelModalEffects } from './effects';
import { RangeValuePipe } from './pipes';
import { reducers } from './reducers';
import { StructuresPagesService, UrlService } from './services';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // 3rd Party
    StoreModule.forFeature('structures_jobBasedRange_shared', reducers),
    EffectsModule.forFeature([ModelSettingsModalEffects, PublishModelModalEffects, SharedEffects, DuplicateModelModalEffects]),
    FontAwesomeModule,
    NgbTabsetModule,
    AutoCompleteModule,
    ComboBoxModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbDropdownModule,

    // Payfactors
    PfDataGridModule,
    PfFormsModule,
    NumericTextBoxModule,
    DropDownListModule,
    ReactiveFormsModule,
    RangeEditorModule,
    PfCommonUIModule
  ],
  declarations: [
    ModelGridComponent,
    RangeRoundingComponent,
    GridContextComponent,
    ModelSettingsModalComponent,
    ModelSettingsBtnComponent,
    RangeValuePipe,
    GlobalActionsComponent,
    RangeDistributionSettingComponent,
    DuplicateModelModalComponent
  ],
  exports: [
    ModelGridComponent,
    GridContextComponent,
    ModelSettingsModalComponent,
    ModelSettingsBtnComponent,
    FontAwesomeModule,
    RangeValuePipe,
    DuplicateModelModalComponent
  ],
  providers: [
    UrlService,
    StructuresPagesService
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
