import { NgModule } from '@angular/core';

import { DebounceClickDirective } from './directives';
import { HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe,
  NewLinePipe, JobDescriptionParserPipe, WrapSubtextWithTag } from './pipes';


const declarations = [
  // Directives
  DebounceClickDirective,

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
