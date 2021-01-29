import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BodyModule, GridModule, PagerModule, SharedModule } from '@progress/kendo-angular-grid';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';
import { LoaderDashboardFileGridComponent, LoaderDashboardFilterComponent, LoaderDashboardGridComponent } from './containers';
import { LoaderDashboardFileGridDetailComponent, LoaderDashboardGridDetailComponent } from './components';
import { reducers } from './reducers';
import { LoaderDashboardPageEffects } from './effects';
import { LoaderDashboardPageRoutingModule } from './loader-dashboard-page-routing.module';
import { LoaderDashboardPageComponent } from './loader-dashboard.page';
import { faIcons } from './fa-icons';
import { GetErrorMessagePipe } from './pipes';
import { CompositeSummaryDownloadEffects } from '../../../dashboard/app/_main/effects';
import { RedropConfirmationModalComponent } from './components/redrop-confirmation-modal';
import { LoaderDashboardSidebarComponent } from './components/loader-dashboard-sidebar';
import { MainModule } from '../../../data-management/app/_main/main.module';
import { PfFieldMapperModule } from '../../../../libs/features/loaders/org-data-loader';
import { LoaderDashboardFileArchiveRedropComponent } from './containers/loader-dashboard-file-archive-redrop';

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
    BodyModule,
    MainModule,
    PfFieldMapperModule
  ],
  declarations: [
    // Pipes
    GetErrorMessagePipe,
    // Pages
    LoaderDashboardPageComponent,
    // Containers
    LoaderDashboardFilterComponent,
    LoaderDashboardGridComponent,
    LoaderDashboardGridDetailComponent,
    LoaderDashboardFileGridComponent,
    LoaderDashboardFileGridDetailComponent,
    LoaderDashboardFileArchiveRedropComponent,
    LoaderDashboardSidebarComponent,
    RedropConfirmationModalComponent
  ]
})
export class LoaderDashboardPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...faIcons);
  }
}
