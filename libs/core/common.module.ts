import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe,
  NewLinePipe, JobDescriptionParserPipe } from './pipes';


const declarations = [
  // Pipes
  HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe, NewLinePipe, JobDescriptionParserPipe
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
