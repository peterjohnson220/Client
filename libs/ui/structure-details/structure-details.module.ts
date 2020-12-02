import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MomentModule } from 'ngx-moment';

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

    // 3rd Party
    MomentModule,

    // Payfactors
    PfCommonModule
  ]
})
export class StructureDetailsModule {
  constructor() {}
}
