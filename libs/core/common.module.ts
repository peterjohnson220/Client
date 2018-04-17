import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe } from './pipes';



const declarations = [
  // Pipes
  HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
