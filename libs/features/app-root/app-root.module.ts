import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppWrapperComponent } from './app-wrapper.component';

import { PfCommonUIModule } from '../../ui/common';
import { PfSecurityModule } from '../../security/security.module';
import { PfLayoutWrapperOldModule } from '../../ui/layout-wrapper-old';

const declarations = [
  // declarations
  AppComponent, AppWrapperComponent
];

@NgModule({
  imports: [
    // Angular
    RouterModule,
    CommonModule,

    // Payfactors
    PfCommonUIModule,
    PfSecurityModule,
    PfLayoutWrapperOldModule,
  ],
  declarations: declarations,
  exports: declarations
})
export class PfAppRootModule { }
