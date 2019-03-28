import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe,
  NewLinePipe, JobDescriptionParserPipe, WrapSubtextWithTag } from './pipes';


const declarations = [
  // Pipes
  HighlightTextPipe,
  HumanizeNumberPipe,
  StringReplacePipe,
  TruncateAfterPipe,
  NewLinePipe,
  JobDescriptionParserPipe,
  WrapSubtextWithTag
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
