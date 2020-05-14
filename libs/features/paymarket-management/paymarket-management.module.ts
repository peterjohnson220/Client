import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { PayMarketModalComponent, GeneralFormComponent } from './containers';
import { reducers } from './reducers';
import { GeneralFormEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_paymarket_management', reducers),
    EffectsModule.forFeature([
      GeneralFormEffects
    ]),
    DropDownsModule,
    NumericTextBoxModule,
    PerfectScrollbarModule,
    NgbModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Containers
    PayMarketModalComponent,
    GeneralFormComponent
  ],
  exports: [ PayMarketModalComponent ]
})
export class PayMarketManagementModule { }
