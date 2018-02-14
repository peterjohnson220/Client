import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';

import { AppComponent } from './app.component';
import { AppWrapperComponent } from './app-wrapper.component';
import { AppNoWrapperComponent } from './app-no-wrapper.component';


const declarations = [
  // declarations
  AppComponent, AppWrapperComponent, AppNoWrapperComponent
];

@NgModule({
  imports: [
    // Angular
    RouterModule,
    CommonModule,

    // Payfactors
    PfCommonUIModule,
    PfSecurityModule,
    PfLayoutWrapperModule,
  ],
  declarations: declarations,
  exports: declarations
})
export class PfAppRootModule { }
