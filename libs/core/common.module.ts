import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, TruncateAfterPipe } from './pipes';


const declarations = [
  // Pipes
  HumanizeNumberPipe, TruncateAfterPipe, HighlightTextPipe
];

@NgModule({
  imports: [],
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
