import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import * as fromFaIcons from './fa-icons';
import { EllipsisViewMoreComponent, NavigationLinksComponent } from './content';
import { ErrorIndicatorComponent, NotFoundErrorPageComponent, AccessDeniedPageComponent } from './error';
import { LoadingIndicatorComponent, LoadingUserContextComponent,
         AsyncContainerComponent } from './loading';
import { PageWithTitleBarComponent, PageWithTitleBarAndGridComponent } from './page-layout';
import { TermsConditionsModalComponent } from './terms-conditions-modal';
import { ValidationResultsComponent } from './validation';
import { PfCommonModule, WindowRef } from '../../core';
import { CardSelectorComponent } from './content/cards/card-selector';
import { CardComponent } from './content/cards/card';
import { AfterIfDirective, ClickElsewhereDirective } from './directives';
import { UserOrEmailPickerComponent } from './user-email-picker/user-or-email-picker.component';
import { MultiSelectComponent } from './content/multi-select';
import { PeerAssociationColorBlockComponent } from './content/peer-association-color-block';

const components = [
  // Content
  EllipsisViewMoreComponent,
  CardComponent,
  CardSelectorComponent,
  UserOrEmailPickerComponent,
  MultiSelectComponent,
  NavigationLinksComponent,
  PeerAssociationColorBlockComponent,

  // Directives
  ClickElsewhereDirective, AfterIfDirective,

  // Error
  ErrorIndicatorComponent, NotFoundErrorPageComponent, AccessDeniedPageComponent,

  // Loading
  AsyncContainerComponent, LoadingIndicatorComponent, LoadingUserContextComponent,

  // Page Layouts
  PageWithTitleBarComponent, PageWithTitleBarAndGridComponent,

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
    ImgFallbackModule,
    FontAwesomeModule,
    ScrollingModule
  ],
  declarations: components,
  exports: components,
  providers: [
    WindowRef
  ]
})
export class PfCommonUIModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
