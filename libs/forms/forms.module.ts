import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromFaIcons from './fa-icons';
import { FocusDirective, PfValidatableDirective, PfSecuredResourceDirective, PfDebounceValueChangedDirective } from './directives';
import { ConfirmPasswordComponent, InputDebounceComponent, PfModalFormComponent,
  LocationSearchComponent, ActionButtonComponent, TypeaheadComponent } from './components';
import { PfCommonUIModule } from '../ui/common';

const declarations = [
  // Directives
  PfValidatableDirective,
  FocusDirective,
  PfSecuredResourceDirective,
  PfDebounceValueChangedDirective,
  // declarations
  ConfirmPasswordComponent,
  PfModalFormComponent,
  InputDebounceComponent,
  LocationSearchComponent,
  ActionButtonComponent,
  TypeaheadComponent
];

@NgModule({
  imports: [
    CommonModule,
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
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
