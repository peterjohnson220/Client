import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MaskedTextBoxModule, NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { ColumnResizingService } from '@progress/kendo-angular-grid';
import { DragulaModule } from 'ng2-dragula';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { SharedModule } from '../../shared/shared.module';
import { CompanyControlsDndService } from './services';
import { reducers } from './reducers';
import { CompanyControlDetailEffects, CompanyControlCopyEffects } from './effects';
import { CompanyControlsDetailPageComponent } from './company-controls-detail.page';
import { ConfirmEditCompanyControlModalComponent,
         DeleteCompanyControlOptionModalComponent,
         CompanyControlHeaderComponent,
         CompanyControlPreviewComponent } from './components';
import { CompanyControlLayoutComponent, CompanyControlFormComponent, CompanyControlCopyModalComponent } from './containers';

@NgModule({
  declarations: [
    CompanyControlsDetailPageComponent,
    CompanyControlFormComponent,
    CompanyControlLayoutComponent,
    ConfirmEditCompanyControlModalComponent,
    DeleteCompanyControlOptionModalComponent,
    CompanyControlHeaderComponent,
    CompanyControlCopyModalComponent,
    CompanyControlPreviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    DragulaModule.forRoot(),
    DropDownsModule,
    MaskedTextBoxModule,
    NumericTextBoxModule,
    StoreModule.forFeature('jobDescriptionManagement_settings_companyControlDetail', reducers),
    EffectsModule.forFeature([CompanyControlDetailEffects, CompanyControlCopyEffects]),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [ ColumnResizingService, CompanyControlsDndService ],
  exports: [CompanyControlsDetailPageComponent]
})
export class CompanyControlsDetailModule { }
