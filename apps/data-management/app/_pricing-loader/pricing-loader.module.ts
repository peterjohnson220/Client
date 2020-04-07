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
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { PfFieldMapperModule } from 'libs/features/org-data-loader';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { PricingLoadersComponent } from './containers';
// import {} from './effects';
import * as fromFaIcons from './fa-icons';
import { PricingLoadersRoutingModule } from './pricing-loader-routing.module';
// import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,

    // Routing
    PricingLoadersRoutingModule,

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
    PfFormsModule,
    PfCompanySelectorModule,
    PfFieldMapperModule
  ],
  declarations: [
    // Pages


    // Components
    PricingLoadersComponent
  ]
})
export class PricingLoaderModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}