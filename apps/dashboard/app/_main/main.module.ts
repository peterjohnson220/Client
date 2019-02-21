import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// PF
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFileDownloadModule } from 'libs/features/file-download';

// Effects
import { DashboardEffects,
  TileGridEffects,
  UserVoiceEffects,
  TimelineActivityEffects,
  DashboardTcModalEffects,
  CompositeSummaryDownloadEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Routing
import { MainRoutingModule } from './main-routing.module';

// Containers
import { DashboardPageComponent } from './containers';
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

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    DragulaModule.forRoot(),
    StoreModule.forFeature('dashboardMain', reducers),
    EffectsModule.forFeature([
      TileGridEffects,
      UserVoiceEffects,
      DashboardEffects,
      TimelineActivityEffects,
      DashboardTcModalEffects,
      CompositeSummaryDownloadEffects
    ]),
    ChartsModule,
    DateInputsModule,
    NgbModule.forRoot(),


    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFileDownloadModule,
  ],
  declarations: [
    // Pages
    DashboardPageComponent,

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
    BasicListComponent
  ]
})
export class MainModule {
}
