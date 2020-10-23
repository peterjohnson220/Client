import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';
import { AdminNavigationLinksModule, PfNavigationLinksModule } from 'libs/features';

import { NavigationPageComponent } from './containers';
import { NavigationRoutingModule } from './navigation-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    NavigationRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfNavigationLinksModule,
    AdminNavigationLinksModule
  ],
    declarations: [
        // Pages
        NavigationPageComponent,
    ]
})
export class NavigationModule { }
