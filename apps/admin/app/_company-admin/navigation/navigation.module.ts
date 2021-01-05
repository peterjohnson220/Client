import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';


import { NavigationPageComponent } from './navigation.page/navigation.page';
import { PfNavigationLinksModule } from 'libs/features/infrastructure/navigation-links';
import { AdminNavigationLinksModule } from 'libs/features/infrastructure/admin-navigation-links';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    GridModule,
    LayoutModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfNavigationLinksModule,
    AdminNavigationLinksModule
  ],
  declarations: [
    // Feature
    NavigationPageComponent,
  ],
  exports: [
    NavigationPageComponent,
  ]
})
export class NavigationModule {
  constructor() { }
}
