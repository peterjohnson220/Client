import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfStateModule } from 'libs/state/state.module';

import { PfCommonUIModule } from '../../ui/common';
import { PfApiModule } from '../../data/payfactors-api';
import { ExchangeListComponent } from './containers';
import { reducers } from './reducers';

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
