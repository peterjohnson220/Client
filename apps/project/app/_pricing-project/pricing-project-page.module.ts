import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DropDownListModule} from '@progress/kendo-angular-dropdowns';

import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { MultiMatchModule } from 'libs/features/pricings/multi-match';
import {OrdinalNumberPipe} from 'libs/core/pipes';

import { HighchartsChartModule } from 'highcharts-angular';

import { ProjectExportModule } from '../_project-export-manager';

import { JobSummaryComponent } from './components/analyze/job-summary/job-summary.component';
import { PricingProjectPageRoutingModule } from './pricing-project-page-routing.module';
import { PricingProjectPageComponent } from './pricing-project.page/pricing-project.page';
import { PricingProjectPageEffects } from './effects';
import { HasAccessToProjectGuard } from '../shared/guards';
import { reducers } from './reducers';

import * as fromFaIcons from './fa-icons';

@NgModule({
    imports: [
        StoreModule.forFeature('pricingProjectPageMain', reducers),
        EffectsModule.forFeature([
                PricingProjectPageEffects
            ]
        ),
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // 3rd Party
        FontAwesomeModule,
        NgbModule,
        NgbDropdownModule,
        DropDownListModule,
        HighchartsChartModule,

        // Routing
        PricingProjectPageRoutingModule,

        // Payfactors
        PfDataGridModule,
        PfCommonModule,
        PfCommonUIModule,
        PfFormsModule,
        ProjectExportModule,
        MultiMatchModule,
    ],
  declarations: [
    // Pages
    PricingProjectPageComponent,
    JobSummaryComponent
  ],
  providers: [
    HasAccessToProjectGuard,
    OrdinalNumberPipe
  ]
})
export class PricingProjectPageModule {
  constructor(library: FaIconLibrary) {
     library.addIcons(...fromFaIcons.faIcons);
  }
}
