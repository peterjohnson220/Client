import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Third party
import { UploadModule } from '@progress/kendo-angular-upload';

// Containers
import { MarketingImageComponent} from './containers';

// Routing
import { MarketingRoutingModule } from './marketing-routing.module';

// Libs / Controls
import { PfCommonUIModule } from 'libs/ui/common';

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
