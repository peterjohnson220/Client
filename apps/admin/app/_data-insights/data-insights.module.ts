import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { StandardReportsListPageComponent } from './containers';
import { StandardReportsListComponent, EditReportModalComponent } from './components';
import { DataInsightsRoutingModule } from './data-insights-routing.module';
import {reducers} from './reducers';
import { StandardReportsListPageEffects } from './effects';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('dataInsightsManagement_main', reducers),
    EffectsModule.forFeature([
      StandardReportsListPageEffects
    ]),
    GridModule,
    FontAwesomeModule,
    UploadModule,

    // Routing
    DataInsightsRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule
  ],
  declarations: [
    // Components
    StandardReportsListComponent, EditReportModalComponent,
    // Pages
    StandardReportsListPageComponent
  ]
})
export class DataInsightsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








