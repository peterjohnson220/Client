import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import * as fromFaIcons from './fa-icons';

// PF
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFileDownloadModule } from 'libs/features/file-download';
import { PfFormsModule } from 'libs/forms/forms.module';

// Effects
import { DashboardEffects,
  TileGridEffects,
  UserVoiceEffects,
  TimelineActivityEffects,
  DashboardTcModalEffects,
  CompositeSummaryDownloadEffects,
  CompanyResourcesPageEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Routing
import { MainRoutingModule } from './main-routing.module';

// Containers
import { DashboardPageComponent, CompanyResourcesPageComponent, CompanyResourceListComponent } from './containers';
import { TileGridComponent } from './containers';
import { TimelineActivityComponent } from './containers';
import { UserVoiceIndicatorComponent } from './containers';
import { DashboardTCModalComponent} from './containers';

// Components
import { TileComponent } from './components';
import { TilePreviewChartComponent } from './components';
import { TilePreviewChartWithCalendarComponent } from './components';
import { TilePreviewChartWithListComponent } from './components';
import { TilePreviewIconComponent } from './components';
import { TilePreviewListComponent } from './components';
import { TilePreviewPlaceHolderComponent } from './components';
import { CompositeSummaryDownloadComponent } from './components';
import { BasicListComponent } from './components';
import { ResourcesComponent } from './containers/resources/resources.component';
import { NewFolderModalComponent } from './containers/new-folder-modal/new-folder-modal.component';
import { ResourceModalComponent } from './containers/resource-modal/resource-modal.component';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // 3rd Party
    DragulaModule.forRoot(),
    StoreModule.forFeature('dashboardMain', reducers),
    EffectsModule.forFeature([
      TileGridEffects,
      UserVoiceEffects,
      DashboardEffects,
      TimelineActivityEffects,
      DashboardTcModalEffects,
      CompositeSummaryDownloadEffects,
      CompanyResourcesPageEffects
    ]),
    ChartsModule,
    DateInputsModule,
    FontAwesomeModule,
    NgbModule.forRoot(),
    UploadModule,
    DropDownsModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFileDownloadModule,
    PfFormsModule,
  ],
  declarations: [
    // Pages
    DashboardPageComponent,
    CompanyResourcesPageComponent,

    // Components
    TileComponent,
    TileGridComponent,
    TilePreviewChartComponent,
    TilePreviewChartWithCalendarComponent,
    TilePreviewChartWithListComponent,
    TilePreviewIconComponent,
    TilePreviewListComponent,
    TilePreviewPlaceHolderComponent,
    TimelineActivityComponent,
    TileComponent,
    UserVoiceIndicatorComponent,
    DashboardTCModalComponent,
    CompositeSummaryDownloadComponent,
    BasicListComponent,
    ResourcesComponent,
    CompanyResourceListComponent,
    NewFolderModalComponent,
    ResourceModalComponent
  ],
  entryComponents: [
    NewFolderModalComponent,
    ResourceModalComponent
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
