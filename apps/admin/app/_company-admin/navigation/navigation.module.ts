import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { AdminNavigationLinksModule, PfNavigationLinksModule } from 'libs/features';

import { NavigationPageComponent } from './navigation.page/navigation.page';

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
