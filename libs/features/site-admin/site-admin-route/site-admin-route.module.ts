import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { SiteAdminRouteEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('feature_siteAdminRoute', reducers),
    EffectsModule.forFeature([
      SiteAdminRouteEffects
    ])
  ]
})

export class PfSiteAdminRouteModule {}


