import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BodyModule, GridModule, PagerModule, SharedModule } from '@progress/kendo-angular-grid';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';
import {
  LoaderDashboardFileArchiveRedropComponent,
  LoaderDashboardFileGridComponent,
  LoaderDashboardFilterComponent,
  LoaderDashboardGridComponent,
} from './containers';
import { LoaderDashboardFileGridDetailComponent, LoaderDashboardGridDetailComponent, LoaderDashboardGridSummaryDetailComponent } from './components';
import { reducers } from './reducers';
import { LoaderDashboardPageEffects } from './effects';
import { LoaderDashboardPageRoutingModule } from './loader-dashboard-page-routing.module';
import { LoaderDashboardPageComponent } from './loader-dashboard.page';
import { faIcons } from './fa-icons';
import { GetErrorMessagePipe } from './pipes';
import { CompositeSummaryDownloadEffects } from '../../../dashboard/app/_main/effects';
import { RedropConfirmationModalComponent } from './components/redrop-confirmation-modal';
import { LoaderDashboardSidebarComponent } from './components/loader-dashboard-sidebar';
import { PfFieldMapperModule } from '../../../../libs/features/loaders/org-data-loader';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
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
    ComboBoxModule,

    // Routing
    LoaderDashboardPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,
    SharedModule,
    BodyModule,
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
    RedropConfirmationModalComponent,
    LoaderDashboardGridSummaryDetailComponent
  ]
})
export class LoaderDashboardPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...faIcons);
  }
}
