import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe,
  HighlightHashTagPipe, FormatLinkUrlPipe } from './pipes';


const declarations = [
  // Pipes
  HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe, HighlightHashTagPipe, FormatLinkUrlPipe
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
