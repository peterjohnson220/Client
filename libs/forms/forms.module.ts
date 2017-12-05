import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PfValidatableDirective } from './index';


const components = [
  PfValidatableDirective
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: components,
  exports: components
})
export class PfFormsModule { }
