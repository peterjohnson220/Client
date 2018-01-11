import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common/index';
import { PfApiModule } from 'libs/data/payfactors-api/index';
import { PfStateModule } from 'libs/state/state.module';

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
    StoreModule.forFeature('sharedPeer', reducers),

    // Payfactors
    PfCommonUIModule,
    PfApiModule,
    PfStateModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfSharedPeerModule { }
