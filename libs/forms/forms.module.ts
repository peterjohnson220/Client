import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FocusDirective, PfValidatableDirective, PfSecuredResourceDirective } from './directives';
import { ConfirmPasswordComponent, InputDebounceComponent, PfModalFormComponent,
  LocationSearchComponent, ActionButtonComponent, TypeaheadComponent } from './components';
import { PfCommonUIModule } from '../ui/common';

const declarations = [
  // Directives
  PfValidatableDirective,
  FocusDirective,
  PfSecuredResourceDirective,
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
  ],
  declarations: declarations,
  exports: declarations
})
export class PfFormsModule { }
