import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { NgbTooltipModule, NgbPopoverModule, NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { EffectsModule } from '@ngrx/effects';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { FormulaEditorModule } from 'libs/ui/formula-editor';

import {
  ModelGridComponent,
  RangeRoundingComponent,
  RangeDistributionSettingComponent,
  DuplicateModelModalComponent,
  ModelSettingsModalContentComponent
} from './containers';
import { PublishModelModalEffects, SharedEffects, DuplicateModelModalEffects, FieldsEffects } from './effects';
import { RangeValuePipe } from './pipes';
import { reducers } from './reducers';
import * as fromFaIcons from './fa-icons';
import { AdvancedModelSettingComponent } from './containers/advanced-model-setting';
import { StructuresFormulaEditorComponent } from './containers/structures-formula-editor/structures-formula-editor.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        // Angular
        CommonModule,
        RouterModule,

        // 3rd Party
        StoreModule.forFeature('structures_jobBasedRange_shared', reducers),
        EffectsModule.forFeature([
            PublishModelModalEffects,
            SharedEffects,
            DuplicateModelModalEffects,
            FieldsEffects,
        ]),
        FontAwesomeModule,
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
        PfCommonUIModule,
        FormulaEditorModule,
        FormsModule,

        SharedModule,
        NgbNavModule
    ],
  declarations: [
    ModelGridComponent,
    RangeRoundingComponent,
    AdvancedModelSettingComponent,
    RangeValuePipe,
    RangeDistributionSettingComponent,
    DuplicateModelModalComponent,
    StructuresFormulaEditorComponent,
    ModelSettingsModalContentComponent
  ],
  exports: [
    ModelGridComponent,
    FontAwesomeModule,
    RangeValuePipe,
    DuplicateModelModalComponent,
    ModelSettingsModalContentComponent
  ],
  providers: [
  ]
})
export class JobBasedSharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
