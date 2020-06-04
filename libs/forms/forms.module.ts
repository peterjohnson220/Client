import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromFaIcons from './fa-icons';
import { PfCommonUIModule } from '../ui/common';

import { PfCommonModule } from 'libs/core';
import { FocusDirective,
  PfValidatableDirective,
  PfSecuredResourceDirective,
  PfDebounceValueChangedDirective,
  PfIndeterminateDirectiveDirective } from './directives';
import {
  ConfirmPasswordComponent,
  InputDebounceComponent,
  PfModalFormComponent,
  LocationSearchComponent,
  ActionButtonComponent,
  TypeaheadComponent,
  JobDescriptionSummaryEditorComponent
} from './components';

const declarations = [
  // Directives
  PfValidatableDirective,
  FocusDirective,
  PfSecuredResourceDirective,
  PfDebounceValueChangedDirective,
  PfIndeterminateDirectiveDirective,
  // declarations
  ConfirmPasswordComponent,
  PfModalFormComponent,
  InputDebounceComponent,
  LocationSearchComponent,
  ActionButtonComponent,
  TypeaheadComponent,
  JobDescriptionSummaryEditorComponent
];

@NgModule({
  imports: [
    CommonModule,
    PfCommonModule,
    PfCommonUIModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfFormsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
