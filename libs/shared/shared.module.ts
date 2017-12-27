import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

import { ExchangeListComponent } from './peer';
import { PfCommonUIModule } from '../ui/common';
import { PfApiModule } from '../data/payfactors-api';
import { PfStateModule } from '../state/state.module';
import { reducers } from './peer/reducers';


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
export class PfSharedModule { }
