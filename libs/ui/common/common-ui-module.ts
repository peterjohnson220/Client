import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ErrorIndicatorComponent } from './error';
import { LoadingIndicatorComponent, LoadingUserContextComponent, LoadingMaskComponent } from './loading';
import { PageWithTitleBarComponent } from './page-layout';

const components = [
  // Error
  ErrorIndicatorComponent,

  // Loading
  LoadingIndicatorComponent, LoadingUserContextComponent, LoadingMaskComponent,

  // Page Layouts
  PageWithTitleBarComponent
];

@NgModule({
  imports:      [
    CommonModule,
    RouterModule,
    NgbModule.forRoot()
  ],
  declarations: components,
  exports: components
})
export class PfCommonUIModule { }
