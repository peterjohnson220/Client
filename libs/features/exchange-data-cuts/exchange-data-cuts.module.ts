import { NgModule } from '@angular/core';
import {reducers} from './reducers';
import {StoreModule} from '@ngrx/store';
import {ExchangeDataCutsComponent} from './exchange-data-cuts/exchange-data-cuts.component';
import {EffectsModule} from '@ngrx/effects';
import {ExchangeDataCutsEffects} from './effects';
import {PfCommonUIModule} from '../../ui/common/common-ui-module';
import {PfCommonModule} from '../../core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataCutPropertyComponent } from './containers/data-cut-property/data-cut-property.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,

    StoreModule.forFeature('feature_exchangeDataCuts', reducers),
    EffectsModule.forFeature([
      ExchangeDataCutsEffects,
    ]),
  ],
  declarations: [ExchangeDataCutsComponent, DataCutPropertyComponent],
  exports: [ExchangeDataCutsComponent],
})
export class ExchangeDataCutsModule { }
