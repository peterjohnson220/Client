import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { PfCommonModule } from 'libs/core';

import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    PfCommonModule,
    StoreModule.forFeature('feature_tempDataCut', reducers)
  ]
})
export class TempDataCutModule {
  constructor() {
  }
}
