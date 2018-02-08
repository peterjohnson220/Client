import { NgModule } from '@angular/core';

import { HumanizeNumberPipe, TruncateAfterPipe } from './pipes';


const declarations = [
  // Pipes
  HumanizeNumberPipe, TruncateAfterPipe
];

@NgModule({
  imports: [],
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
