import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgbModule, NgbTooltipModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { PopupModule } from '@progress/kendo-angular-popup';

import * as fromFaIcons from './fa-icons';
import { EllipsisViewMoreComponent, TreeViewMultiSelectComponent } from './content';
import {
  ErrorIndicatorComponent,
  BaseErrorPageComponent,
  NotFoundErrorPageComponent,
  AccessDeniedPageComponent,
  TokenExpirationPageComponent,
  ForbiddenPageComponent,
  ServerErrorPageComponent,
  ReviewLinkExpiredPageComponent
} from './error';
import {
  LoadingIndicatorComponent, LoadingUserContextComponent,
  AsyncContainerComponent
} from './loading';
import { PageWithTitleBarComponent, PageWithLeftMenuComponent } from './page-layout';
import { TermsConditionsModalComponent } from './terms-conditions-modal';
import { ValidationResultsComponent } from './validation';
import { PfCommonModule, WindowRef } from '../../core';
import { CardSelectorComponent } from './content/cards/card-selector';
import { CardComponent } from './content/cards/card';
import { AfterIfDirective, ClickElsewhereDirective, EllipsisActiveDirective, PfScrollSpyDirective } from './directives';
import { UserOrEmailPickerComponent } from './user-email-picker/user-or-email-picker.component';
import { MultiSelectComponent } from './content/multi-select';
import { PeerAssociationColorBlockComponent } from './content/peer-association-color-block';
import { SimpleYesNoModalComponent } from './simple-yes-no';
import { LoadingProgressBarService } from './loading/service';
import { PfTreeViewComponent, TreeViewCheckDirective } from './pf-treeview';
import { JobTitleCodeComponent } from './job-title-code/job-title-code.component';
import { FileDownloadSecurityWarningModalComponent } from './file-download-security-warning';

const components = [
  // Content
  EllipsisViewMoreComponent,
  CardComponent,
  CardSelectorComponent,
  UserOrEmailPickerComponent,
  MultiSelectComponent,
  PeerAssociationColorBlockComponent,
  SimpleYesNoModalComponent,
  PfTreeViewComponent,
  JobTitleCodeComponent,
  TreeViewMultiSelectComponent,

  // Directives
  ClickElsewhereDirective, AfterIfDirective, EllipsisActiveDirective, TreeViewCheckDirective, PfScrollSpyDirective,

  // Error
  BaseErrorPageComponent,
  ErrorIndicatorComponent,
  NotFoundErrorPageComponent,
  AccessDeniedPageComponent,
  TokenExpirationPageComponent,
  ForbiddenPageComponent,
  ServerErrorPageComponent,
  ReviewLinkExpiredPageComponent,

  // Loading
  AsyncContainerComponent, LoadingIndicatorComponent, LoadingUserContextComponent,

  // Page Layouts
  PageWithTitleBarComponent, PageWithLeftMenuComponent,

  // Modals
  TermsConditionsModalComponent,
  FileDownloadSecurityWarningModalComponent,

  // Validation
  ValidationResultsComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PfCommonModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ImgFallbackModule,
    FontAwesomeModule,
    ScrollingModule,
    TreeViewModule,
    PopupModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    WindowRef,
    LoadingProgressBarService
  ]
})
export class PfCommonUIModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
