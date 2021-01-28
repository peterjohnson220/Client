import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureDetailsComponent } from './structure-details/structure-details.component';
import { PfCommonModule } from '../../core';

@NgModule({
  declarations: [
    // Feature
    StructureDetailsComponent,

    // Components
  ],
  exports: [
    StructureDetailsComponent
  ],
  imports: [
    // Angular
    CommonModule,

    // Payfactors
    PfCommonModule
  ]
})
export class StructureDetailsModule {
  constructor() {}
}
