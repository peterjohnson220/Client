import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { NavigationEffects } from './effects';

@NgModule({
  imports: [

    // 3rd Party
    StoreModule.forFeature('feature_NavigationLinks', reducers),
    EffectsModule.forFeature([NavigationEffects])
  ]
})
export class AdminNavigationLinksModule { }
