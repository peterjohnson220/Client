import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfNavigationLinksModule } from 'libs/features/infrastructure/navigation-links';
import { AdminNavigationLinksModule } from 'libs/features/infrastructure/admin-navigation-links';

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
