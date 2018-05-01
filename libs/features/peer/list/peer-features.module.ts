import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfStateModule } from 'libs/state/state.module';

import { PfCommonUIModule } from '../../../ui/common/index';
import { PfApiModule } from '../../../data/payfactors-api/index';
import { ExchangeListComponent } from './containers/index';
import { reducers } from './reducers/index';

const declarations = [
  // declarations
  ExchangeListComponent
];

@NgModule({
  imports: [
    CommonModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peerFeatures', reducers),

    // Payfactors
    PfCommonUIModule,
    PfApiModule,
    PfStateModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfPeerFeaturesModule { }
