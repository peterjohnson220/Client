import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BodyModule, GridModule, PagerModule, SharedModule} from '@progress/kendo-angular-grid';
import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
import {TooltipModule} from '@progress/kendo-angular-tooltip';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';

import { LoaderDashboardFilterComponent,
  LoaderDashboardGridComponent} from './containers';
import { reducers } from './reducers';
import { LoaderDashboardPageEffects } from './effects';
import { LoaderDashboardPageRoutingModule } from './loader-dashboard-page-routing.module';
import { LoaderDashboardPageComponent } from './loader-dashboard.page';
import { faIcons } from './fa-icons';

import {CompositeSummaryDownloadEffects} from '../../../dashboard/app/_main/effects';
import { LoaderDashboardGridDetailComponent } from './containers/loader-dashboard-grid-detail/loader-dashboard-grid-detail.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    FontAwesomeModule,
    StoreModule.forFeature('loaderdashboard_main', reducers),
    EffectsModule.forFeature([
      LoaderDashboardPageEffects,
      CompositeSummaryDownloadEffects
    ]),
    // Kendo
    GridModule,
    PagerModule,
    DateInputsModule,

    // Routing
    LoaderDashboardPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,
    SharedModule,
    BodyModule
  ],
  declarations: [
    // Pages
    LoaderDashboardPageComponent,
    // Containers
    LoaderDashboardFilterComponent,
    LoaderDashboardGridComponent,
    LoaderDashboardGridDetailComponent
  ]
})
export class LoaderDashboardPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...faIcons);
  }
}