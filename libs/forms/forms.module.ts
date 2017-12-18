import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PfValidatableDirective } from './directives';
import { PfModalFormComponent } from './components';
import { PfCommonUIModule } from '../ui/common';


const components = [
  PfValidatableDirective,
  PfModalFormComponent
];

@NgModule({
  imports: [
    CommonModule,
    PfCommonUIModule,
    ReactiveFormsModule
  ],
  declarations: components,
  exports: components
})
export class PfFormsModule { }
