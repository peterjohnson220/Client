import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PfCommonUIModule } from 'libs/ui/common';

import { LayoutPageComponent } from './layout.page';

@NgModule({
  imports: [
    // Angular
    CommonModule, RouterModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Feature
    LayoutPageComponent,
  ],
  exports: [
    LayoutPageComponent,
  ]
})
export class LayoutModule {
  constructor() { }
}
