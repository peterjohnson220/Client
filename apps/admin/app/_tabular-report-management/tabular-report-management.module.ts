import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { ExportSchedulerModule } from 'libs/features';

import { TabularReportManagementRoutingModule } from './tabular-report-management-routing.module';
import { TabularReportExportSchedulerPageComponent } from './containers';
import { reducers } from './reducers';
import { TabularReportExportSchedulerPageEffects } from './effects';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('tabularReportManagement_main', reducers),
    EffectsModule.forFeature([
      TabularReportExportSchedulerPageEffects
    ]),
    GridModule,
    FontAwesomeModule,
    UploadModule,
    DropDownsModule,

    // Routing
    TabularReportManagementRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule,
    ExportSchedulerModule
  ],
  declarations: [
    // Components

    // Pages
    TabularReportExportSchedulerPageComponent,
  ]
})
export class TabularReportManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
