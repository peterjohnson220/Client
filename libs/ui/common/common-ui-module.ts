import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EllipsisViewMoreComponent } from './content';
import { ErrorIndicatorComponent, NotFoundErrorPageComponent, AccessDeniedPageComponent } from './error';
import { LoadingIndicatorComponent, LoadingUserContextComponent,
         AsyncContainerComponent } from './loading';
import { PageWithTitleBarComponent } from './page-layout';
import {TermsConditionsModalComponent} from './terms-conditions-modal';
import { ValidationResultsComponent } from './validation';
import { PfCommonModule } from '../../core';
import { CardSelectorComponent } from './content/cards/card-selector';
import { CardComponent } from './content/cards/card';

const components = [
  // Content
  EllipsisViewMoreComponent,
  CardComponent,
  CardSelectorComponent,

  // Error
  ErrorIndicatorComponent, NotFoundErrorPageComponent, AccessDeniedPageComponent,

  // Loading
  AsyncContainerComponent, LoadingIndicatorComponent, LoadingUserContextComponent,

  // Page Layouts
  PageWithTitleBarComponent,

  // Modals
  TermsConditionsModalComponent,

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
