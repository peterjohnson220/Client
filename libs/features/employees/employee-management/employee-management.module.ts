import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { EmployeeManagementEffects } from './effects/employee-management.effects';
import { reducers } from './reducers';
import { EmployeeBenefitsComponent, EmployeeManagementComponent } from './containers';
import { EmployeeBenefitEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_employee_management', reducers),
    EffectsModule.forFeature([
      EmployeeManagementEffects,
      EmployeeBenefitEffects
    ]),
    LayoutModule,
    DropDownsModule,
    DateInputsModule,
    NumericTextBoxModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    EmployeeManagementComponent,
    EmployeeBenefitsComponent
  ],
  exports: [
    EmployeeManagementComponent,
    EmployeeBenefitsComponent
  ]
})

export class EmployeeManagementModule { }
