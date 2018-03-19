import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EllipsisViewMoreComponent } from './content';
import { ErrorIndicatorComponent, NotFoundErrorPageComponent } from './error';
import { LoadingIndicatorComponent, LoadingUserContextComponent,
         AsyncContainerComponent } from './loading';
import { PageWithTitleBarComponent } from './page-layout';
import { ValidationResultsComponent } from './validation';
import { PfCommonModule } from '../../core';

const components = [
  // Content
  EllipsisViewMoreComponent,

  // Error
  ErrorIndicatorComponent, NotFoundErrorPageComponent,

  // Loading
  AsyncContainerComponent, LoadingIndicatorComponent, LoadingUserContextComponent,

  // Page Layouts
  PageWithTitleBarComponent,

  // Validation
  ValidationResultsComponent
];

@NgModule({
  imports:      [
    CommonModule,
    RouterModule,
    PfCommonModule
  ],
  declarations: components,
  exports: components
})
export class PfCommonUIModule { }
