import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MarketingSettingsEffects } from 'libs/features/infrastructure/marketing-settings/marketing-settings/effects/marketing-settings.effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { UploadModule } from '@progress/kendo-angular-upload';

// Containers
import { MarketingSettingsComponent} from './containers';

// Routing
import { MarketingRoutingModule } from './marketing-routing.module';

// Libs / Controls
import { PfCommonUIModule } from 'libs/ui/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    PfCommonUIModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    UploadModule,
    StoreModule.forFeature('marketingMain', reducers),
    EffectsModule.forFeature([
      MarketingSettingsEffects,
    ]),

    // Routing
    MarketingRoutingModule
  ],
  declarations: [
    // Components
    MarketingSettingsComponent
  ]
})
export class MarketingModule { }
