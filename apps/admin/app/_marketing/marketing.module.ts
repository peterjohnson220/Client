import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingImageComponent} from './containers';

import { UploadModule } from '@progress/kendo-angular-upload';
import { PfCommonUIModule } from 'libs/ui/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    PfCommonUIModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    UploadModule,

    // Routing
    MarketingRoutingModule
  ],
  declarations: [
    // Components
    MarketingImageComponent
  ]
})
export class MarketingModule { }
