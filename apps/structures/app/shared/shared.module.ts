import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgbDropdownModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NumericTextBoxModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import * as fromFaIcons from './fa-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RangeEditorModule } from 'libs/features/structures/range-editor';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { FormulaEditorModule } from 'libs/ui/formula-editor';
import { RangeFieldEditorComponent } from 'libs/features/structures/range-editor/containers/range-field-editor';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';
import { PfSearchModule } from 'libs/features/search/search';
import { PfAddJobsToRangeModule } from 'libs/features/structures/add-jobs-to-range';
import { WindowCommunicationService } from 'libs/core/services';
import { RangeValuePipe } from 'libs/features/structures/add-jobs-to-range/pipes';

import { RangeGroupExistsGuard } from './guards';
import { reducers } from './reducers';
import {
  AddJobsModalEffects, FormulaFieldEffects,
  ModelSettingsModalEffects,
  SearchPageEffects,
  SearchResultsEffects,
  SharedEffects,
  SingledFilterEffects
} from './effects';
import { GridContextComponent } from './components/grid-context';
import { GlobalActionsComponent } from './components/global-actions';
import { ModelSettingsBtnComponent } from './components/model-settings-btn';
import { StructuresPagesService, UrlService } from './services';
import { AddJobsModalWrapperComponent } from './containers/add-jobs-modal-wrapper';
import { ModelSettingsModalComponent } from './containers/model-settings-modal/model-settings-modal.component';
import { RangeRoundingComponent } from './containers/range-rounding';
import { PublishModelModalComponent } from './containers/publish-model-modal';


@NgModule({
    imports: [
        // Angular
        CommonModule,
        RouterModule,

      // 3rd party
      StoreModule.forFeature('structures_shared', reducers),
      EffectsModule.forFeature([
        SharedEffects,
        AddJobsModalEffects,
        SearchPageEffects,
        SearchResultsEffects,
        SingledFilterEffects,
        ModelSettingsModalEffects,
        FormulaFieldEffects
      ]),
      FontAwesomeModule,
      NgbTabsetModule,
      AutoCompleteModule,
      ComboBoxModule,
      NgbTooltipModule,
      NgbPopoverModule,
      NgbDropdownModule,
      CodemirrorModule,
      SwitchModule,

      // Payfactors
      PfDataGridModule,
      PfFormsModule,
      NumericTextBoxModule,
      DropDownListModule,
      ReactiveFormsModule,
      RangeEditorModule,
      PfCommonUIModule,
      FormulaEditorModule,
      FormsModule,
      PfAddJobsModule,
      PfSearchModule,
      PfAddJobsToRangeModule
    ],
  declarations: [
    GridContextComponent,
    GlobalActionsComponent,
    ModelSettingsBtnComponent,
    AddJobsModalWrapperComponent,
    ModelSettingsModalComponent,
    RangeRoundingComponent,
    PublishModelModalComponent,
  ],
  exports: [
    FontAwesomeModule,
    GridContextComponent,
    GlobalActionsComponent,
    ModelSettingsBtnComponent,
    RangeFieldEditorComponent,
    AddJobsModalWrapperComponent,
    RangeValuePipe,
    ModelSettingsModalComponent,
    RangeRoundingComponent,
    PublishModelModalComponent,
  ],
  providers: [
    RangeGroupExistsGuard,
    StructuresPagesService,
    UrlService,
    WindowCommunicationService
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
