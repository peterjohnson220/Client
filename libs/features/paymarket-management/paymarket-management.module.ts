import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { GridModule } from '@progress/kendo-angular-grid';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { BasicDataGridModule } from 'libs/features/basic-data-grid';

import { PayMarketModalComponent, GeneralFormComponent, MarketDataScopeComponent,
  DefaultScopesComponent, ExchangeScopesComponent, PaymarketAssociationsComponent,
  PricingProjectsComponent,
  PricingsComponent,
  EmployeeRecordsComponent,
  StructuresComponent
} from './containers';
import { reducers } from './reducers';
import { GeneralFormEffects, MarketDataScopeEffects, DefaultScopesEffects, ExchangeScopesEffects,
  PayMarketModalEffects, PaymarketAssociationsEffects
} from './effects';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_paymarket_management', reducers),
    EffectsModule.forFeature([
      GeneralFormEffects,
      MarketDataScopeEffects,
      DefaultScopesEffects,
      ExchangeScopesEffects,
      PayMarketModalEffects,
      PaymarketAssociationsEffects
    ]),
    DropDownsModule,
    NumericTextBoxModule,
    PerfectScrollbarModule,
    NgbModule,
    FontAwesomeModule,
    GridModule,
    InfiniteScrollModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    BasicDataGridModule
  ],
  declarations: [
    // Containers
    PayMarketModalComponent,
    GeneralFormComponent,
    MarketDataScopeComponent,
    DefaultScopesComponent,
    ExchangeScopesComponent,
    PaymarketAssociationsComponent,
    PricingProjectsComponent,
    PricingsComponent,
    EmployeeRecordsComponent,
    StructuresComponent
  ],
  exports: [ PayMarketModalComponent, PaymarketAssociationsComponent ]
})
export class PayMarketManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
