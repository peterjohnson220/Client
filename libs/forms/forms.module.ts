import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FocusDirective, PfValidatableDirective } from './directives';
import { PfModalFormComponent } from './components';
import { PfCommonUIModule } from '../ui/common';


const declarations = [
  // Directives
  PfValidatableDirective,
  FocusDirective,
  // declarations
  PfModalFormComponent
];

@NgModule({
  imports: [
    CommonModule,
    PfCommonUIModule,
    ReactiveFormsModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfFormsModule { }
