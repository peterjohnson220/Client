import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe,
  HighlightHashTagPipe, FormatLinkUrlPipe, NewLinePipe } from './pipes';


const declarations = [
  // Pipes
  HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe, HighlightHashTagPipe, FormatLinkUrlPipe, NewLinePipe
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
