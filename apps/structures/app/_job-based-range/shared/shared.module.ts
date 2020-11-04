import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { NgbTabsetModule, NgbTooltipModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { EffectsModule } from '@ngrx/effects';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { PfFormsModule } from 'libs/forms';
import { RangeEditorModule } from 'libs/features/structures';
import { PfCommonUIModule } from 'libs/ui/common';
import { FormulaEditorModule } from 'libs/features/formula-editor';

import { GlobalActionsComponent, GridContextComponent, ModelSettingsBtnComponent } from './components';
import {
  ModelGridComponent,
  ModelSettingsModalComponent,
  RangeRoundingComponent,
  RangeDistributionSettingComponent,
  DuplicateModelModalComponent
} from './containers';
import { ModelSettingsModalEffects, PublishModelModalEffects, SharedEffects, DuplicateModelModalEffects, FieldsEffects, FormulaFieldEffects } from './effects';
import { RangeValuePipe } from './pipes';
import { reducers } from './reducers';
import { StructuresPagesService, UrlService } from './services';
import * as fromFaIcons from './fa-icons';
import { AdvancedModelingComponent } from './containers/advanced-modeling';
import { StructuresFormulaEditorComponent } from './containers/structures-formula-editor/structures-formula-editor.component';

@NgModule({
    imports: [
        // Angular
        CommonModule,
        RouterModule,

        // 3rd Party
        StoreModule.forFeature('structures_jobBasedRange_shared', reducers),
        EffectsModule.forFeature([
            ModelSettingsModalEffects,
            PublishModelModalEffects,
            SharedEffects,
            DuplicateModelModalEffects,
            FieldsEffects,
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
        FormsModule
    ],
  declarations: [
    ModelGridComponent,
    RangeRoundingComponent,
    AdvancedModelingComponent,
    GridContextComponent,
    ModelSettingsModalComponent,
    ModelSettingsBtnComponent,
    RangeValuePipe,
    GlobalActionsComponent,
    RangeDistributionSettingComponent,
    DuplicateModelModalComponent,
    StructuresFormulaEditorComponent
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
