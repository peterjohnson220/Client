import { NgModule } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import * as fromFaIcons from './fa-icons';
import { DebounceClickDirective, DisableFormControlDirective, DragDropDirective } from './directives';
import {
    CompPipe, DataTypeFilterPipe, FilterArrayByName, GetFileExtensionCssClassPipe, HighlightTextPipe, HumanizeNumberPipe,
    JobDescriptionParserPipe, NewLinePipe, OrderByPipe, StringReplacePipe, StripHtmlPipe, TruncateAfterPipe, WrapSubtextWithTag,
  EmptyPlaceholderPipe, ValidationErrorsPipe
} from './pipes';
import { DragulaHelperService } from './services';

const declarations = [
  // Directives
  DebounceClickDirective,
  DisableFormControlDirective,
  DragDropDirective,

  // Pipes
  HighlightTextPipe,
  HumanizeNumberPipe,
  StringReplacePipe,
  TruncateAfterPipe,
  NewLinePipe,
  DataTypeFilterPipe,
  JobDescriptionParserPipe,
  WrapSubtextWithTag,
  OrderByPipe,
  FilterArrayByName,
  GetFileExtensionCssClassPipe,
  StripHtmlPipe,
  CompPipe,
  EmptyPlaceholderPipe,
  ValidationErrorsPipe
];

const providers = [
  DragulaHelperService,
  DecimalPipe
];

@NgModule({
  declarations: declarations,
  exports: declarations,
  imports: [FontAwesomeModule],
  providers: providers
})
export class PfCommonModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
