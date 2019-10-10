import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import * as fromFaIcons from './fa-icons';
import { DebounceClickDirective, DisableFormControlDirective } from './directives';
import {
  HighlightTextPipe, HumanizeNumberPipe, StringReplacePipe, TruncateAfterPipe,
  NewLinePipe, JobDescriptionParserPipe, WrapSubtextWithTag, DataTypeFilterPipe,
  OrderByPipe, FilterArrayByName, GetFileExtensionCssClassPipe, StripHtmlPipe
} from './pipes';
import { DragulaHelperService } from './services';

const declarations = [
  // Directives
  DebounceClickDirective,
  DisableFormControlDirective,

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
  StripHtmlPipe
];

const providers = [
  DragulaHelperService
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
