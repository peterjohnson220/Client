import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfNavigationLinksModule } from 'libs/features';

import { NavigationEffects } from './effects/navigation.effects';
import { reducers } from './reducers';

import { NavigationPageComponent } from './navigation.page/navigation.page';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('companyAdminNavigation', reducers),
    EffectsModule.forFeature([
      NavigationEffects,
    ]),
    GridModule,
    LayoutModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfNavigationLinksModule
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
