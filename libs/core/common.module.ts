import { NgModule } from '@angular/core';

import { HumanizeNumberPipe } from './pipes';


const declarations = [
  // Pipes
  HumanizeNumberPipe
];

@NgModule({
  imports: [],
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
