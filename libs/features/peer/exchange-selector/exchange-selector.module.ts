import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms';

import { ExchangeSelectorComponent } from './exchange-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // PF Modules
    PfCommonUIModule,
    PfFormsModule,

    // 3rd Party
    DropDownsModule
  ],
  declarations: [
    ExchangeSelectorComponent
  ],
  exports: [
    ExchangeSelectorComponent
  ]
})
export class ExchangeSelectorModule {
  constructor() { }
}
