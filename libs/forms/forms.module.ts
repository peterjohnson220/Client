import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FocusDirective, PfValidatableDirective } from './directives';
import { ConfirmPasswordComponent, InputDebounceComponent, PfModalFormComponent, ActionButtonComponent } from './components';
import { PfCommonUIModule } from '../ui/common';

const declarations = [
  // Directives
  PfValidatableDirective,
  FocusDirective,
  // declarations
  ConfirmPasswordComponent,
  PfModalFormComponent,
  InputDebounceComponent,
  ActionButtonComponent
];

@NgModule({
  imports: [
    CommonModule,
    PfCommonUIModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: declarations,
  exports: declarations
})
export class PfFormsModule { }
