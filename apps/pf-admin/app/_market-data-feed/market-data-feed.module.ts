import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';

import { MarketDataFeedExportCardComponent } from './components';

import { faIcons } from './fa-icons';
import { reducers } from './reducers';

import { MarketDataFeedPageEffects } from './effects/market-data-feed-page.effects';
import { MarketDataFeedPageComponent } from './market-data-feed.page';
import { MarketDataFeedPageRoutingModule } from './market-data-feed-routing.module';



@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    MarketDataFeedPageRoutingModule,

    // 3rd Party
    StoreModule.forFeature('marketDataFeed_main', reducers),
    EffectsModule.forFeature([
      MarketDataFeedPageEffects
    ]),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule
  ],
  declarations: [
    // Pages
    MarketDataFeedPageComponent,

    // Components
    MarketDataFeedExportCardComponent,

  ]
})
export class MarketDataFeedPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...faIcons);
  }
}
