import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';

import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobsPageRoutingModule } from './jobs-page-routing.module';

import { ComplexColumnComponent } from './components/complex-column/complex-column.component';
import { JobsDetailsComponent } from './components/jobs-details/jobs-details.component';




@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    LayoutModule,

    // Routing
    JobsPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
  ],
  declarations: [
    // Pages
    JobsPageComponent,

    // Components
    ComplexColumnComponent,
    JobsDetailsComponent
  ]
})
export class JobsPageModule { }
