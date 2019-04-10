import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { EllipsisViewMoreComponent, NavigationLinksComponent } from './content';
import { ErrorIndicatorComponent, NotFoundErrorPageComponent, AccessDeniedPageComponent } from './error';
import { LoadingIndicatorComponent, LoadingUserContextComponent,
         AsyncContainerComponent } from './loading';
import { PageWithTitleBarComponent } from './page-layout';
import { TermsConditionsModalComponent } from './terms-conditions-modal';
import { ValidationResultsComponent } from './validation';
import { PfCommonModule } from '../../core';
import { CardSelectorComponent } from './content/cards/card-selector';
import { CardComponent } from './content/cards/card';
import { ClickElsewhereDirective } from './directives';
import { UserOrEmailPickerComponent } from './user-email-picker/user-or-email-picker.component';
import { MultiSelectComponent } from './content/multi-select';

const components = [
  // Content
  EllipsisViewMoreComponent,
  CardComponent,
  CardSelectorComponent,
  UserOrEmailPickerComponent,
  MultiSelectComponent,
  NavigationLinksComponent,

  // Directives
  ClickElsewhereDirective,

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
    PfCommonModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ImgFallbackModule
  ],
  declarations: components,
  exports: components
})
export class PfCommonUIModule { }
