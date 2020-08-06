import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';
import { DebounceClickDirective, DisableFormControlDirective, DragDropDirective } from './directives';
import {
  CompPipe, DataTypeFilterPipe, FilterArrayByName, GetFileExtensionCssClassPipe, HighlightTextPipe, HumanizeNumberPipe,
  JobDescriptionParserPipe, NewLinePipe, OrderByPipe, StringReplacePipe, StripHtmlPipe, TruncateAfterPipe, WrapSubtextWithTag,
  EmptyPlaceholderPipe, ValidationErrorsPipe, TimeElapsedPipe, EditableJobDescriptionPipe, RateCurrencyConversionPipe
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
  ValidationErrorsPipe,
  TimeElapsedPipe,
  EditableJobDescriptionPipe,
  RateCurrencyConversionPipe
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
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
