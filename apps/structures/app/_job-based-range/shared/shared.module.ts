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

import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { PfFormsModule } from 'libs/forms';
import { RangeEditorModule } from 'libs/features/structures';
import { PfCommonUIModule } from 'libs/ui/common';
import { FormulaEditorModule } from 'libs/ui/formula-editor';

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
import { UrlService } from './services';
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
        FormsModule,

        SharedModule
    ],
  declarations: [
    ModelGridComponent,
    RangeRoundingComponent,
    AdvancedModelSettingComponent,
    ModelSettingsModalComponent,
    RangeValuePipe,
    RangeDistributionSettingComponent,
    DuplicateModelModalComponent,
    StructuresFormulaEditorComponent
  ],
  exports: [
    ModelGridComponent,
    ModelSettingsModalComponent,
    FontAwesomeModule,
    RangeValuePipe,
    DuplicateModelModalComponent
  ],
  providers: [
    UrlService,
  ]
})
export class JobBasedSharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
