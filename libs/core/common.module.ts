import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe, HighlightHashTagPipe } from './pipes';


const declarations = [
  // Pipes
  HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe, HighlightHashTagPipe
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
