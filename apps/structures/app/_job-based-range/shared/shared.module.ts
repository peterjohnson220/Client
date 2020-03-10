import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { PfDataGridModule } from 'libs/features/pf-data-grid';

import { GridContextComponent } from './components';
import { ModelGridComponent } from './containers';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // 3rd Party
    StoreModule.forFeature('structures_jobBasedRange_shared', reducers),

    // Payfactors
    PfDataGridModule
  ],
  declarations: [
    ModelGridComponent,
    GridContextComponent
  ],
  exports: [
    ModelGridComponent,
    GridContextComponent
  ]
})
export class SharedModule {
  constructor() { }
}
