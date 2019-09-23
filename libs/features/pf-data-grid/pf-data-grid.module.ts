import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfDataGridComponent } from './pf-data-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    LayoutModule
  ],
  declarations: [
    PfDataGridComponent
  ],
  exports: [
    PfDataGridComponent
  ]
})
export class PfDataGridModule { }
