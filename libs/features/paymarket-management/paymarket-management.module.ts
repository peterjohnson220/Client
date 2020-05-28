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

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { PayMarketModalComponent, GeneralFormComponent, MarketDataScopeComponent,
  DefaultScopesComponent
} from './containers';
import { reducers } from './reducers';
import { GeneralFormEffects, MarketDataScopeEffects, DefaultScopesEffects } from './effects';
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
      DefaultScopesEffects
    ]),
    DropDownsModule,
    NumericTextBoxModule,
    PerfectScrollbarModule,
    NgbModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Containers
    PayMarketModalComponent,
    GeneralFormComponent,
    MarketDataScopeComponent,
    DefaultScopesComponent
  ],
  exports: [ PayMarketModalComponent ]
})
export class PayMarketManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
