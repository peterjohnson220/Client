import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

import { NavigationPageComponent } from './containers';
import { NavigationEffects } from './effects';
import { reducers } from './reducers';
import { NavigationRoutingModule } from './navigation-routing.module';
import { PfNavigationLinksModule } from '../../../../libs/features/navigation-links';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('pf-admin_navigation', reducers),
    EffectsModule.forFeature([
      NavigationEffects
    ]),

    // Routing
    NavigationRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfNavigationLinksModule
  ],
    declarations: [
        // Pages
        NavigationPageComponent,
    ]
})
export class NavigationModule { }
