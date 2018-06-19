import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Effects
import { MarketingImageEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UploadModule } from '@progress/kendo-angular-upload';

// Containers
import { MarketingImageComponent} from './containers';

// Routing
import { MarketingRoutingModule } from './marketing-routing.module';

// Libs / Controls
import { PfCommonUIModule } from 'libs/ui/common';

// Services
import { MarketingApiService } from 'libs/data/payfactors-api/marketing/marketing-api.service';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    PfCommonUIModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    UploadModule,
    StoreModule.forFeature('marketing', reducers),
    EffectsModule.forFeature([MarketingImageEffects]),

    // Routing
    MarketingRoutingModule
  ],
  declarations: [
    // Components
    MarketingImageComponent
  ],
  providers: [ MarketingApiService ]
})
export class MarketingModule { }
