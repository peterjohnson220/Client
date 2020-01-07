import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { TotalRewardsPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';
import { StatementsGridComponent } from './containers/statements-grid/statements-grid.component';
import { CreateNewStatementModalComponent } from './containers/create-new-statement-modal/create-new-statement-modal.component';
import { reducers } from './reducers';
import { StatementsEffects, CreateNewStatementEffects } from './effects';
import { CreateNewStatementBannerComponent } from './components/create-new-statement-banner/create-new-statement-banner.component';
import { GridActionMenuComponent } from './components/grid-action-menu/grid-action-menu.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards', reducers),
    EffectsModule.forFeature([StatementsEffects, CreateNewStatementEffects]),
    GridModule,
    FontAwesomeModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    TotalRewardsPageComponent,

    // Containers
    StatementsGridComponent,
    CreateNewStatementModalComponent,

    // Components
    CreateNewStatementBannerComponent,
    GridActionMenuComponent
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
