import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgbDropdownModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NumericTextBoxModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as fromFaIcons from './fa-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RangeEditorModule } from 'libs/features/structures/range-editor';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { FormulaEditorModule } from 'libs/ui/formula-editor';

import { RangeGroupExistsGuard } from './guards';
import { RangeValuePipe } from './pipes';
import { GridContextComponent } from './components/grid-context';
import { GlobalActionsComponent } from './components/global-actions';
import { ModelSettingsBtnComponent } from './components/model-settings-btn';
import { reducers } from './reducers';
import { StructuresPagesService } from './services';


@NgModule({
    imports: [
        // Angular
        CommonModule,
        RouterModule,

      // 3rd party
      StoreModule.forFeature('structures_shared', reducers),
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

    ],
  declarations: [
    RangeValuePipe,
    GridContextComponent,
    GlobalActionsComponent,
    ModelSettingsBtnComponent
  ],
  exports: [
    FontAwesomeModule,
    RangeValuePipe,
    GridContextComponent,
    ModelSettingsBtnComponent
  ],
  providers: [
    RangeGroupExistsGuard,
    StructuresPagesService
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
