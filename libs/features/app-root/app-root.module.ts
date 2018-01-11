import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfLayoutWrapperOldModule } from 'libs/ui/layout-wrapper-old';

import { AppComponent } from './app.component';
import { AppWrapperComponent } from './app-wrapper.component';


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
