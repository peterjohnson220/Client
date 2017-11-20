import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingIndicatorComponent, LoadingUserContextComponent } from './loading';
import { PageWithTitleBarComponent } from './page-layout';

const components = [
  // Loading
  LoadingIndicatorComponent, LoadingUserContextComponent,

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
export class PFCommonUIModule { }
