import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbTabsetModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { PfCommonModule } from 'libs/core';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid/pf-data-grid.module';

import { PricingLoaderDownloadComponent } from './containers';
// import {} from './effects';

import { PricingLoaderDownloadRoutingModule } from './pricing-loader-download-routing.module';
// import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,

    // Routing
    PricingLoaderDownloadRoutingModule,

    // 3rd Party
    DragulaModule.forRoot(),
    // StoreModule.forFeature('data_management', reducers),
    // EffectsModule.forFeature([
    //   ProviderListEffects
    // ]),
    FontAwesomeModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbCollapseModule,
    UploadModule,
    LayoutModule,
    NumericTextBoxModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfDataGridModule,
    PfFormsModule
  ],
  declarations: [
    // Pages


    // Components
    PricingLoaderDownloadComponent
  ]
})
export class PricingLoaderDownloadModule {
}
