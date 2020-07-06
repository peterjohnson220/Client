import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import * as fromFaIcons from './fa-icons';
import {
  CommentBoxComponent,
  CommentContentComponent,
  ReplyBoxComponent,
  TextCounterComponent,
  ReplyListComponent
} from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    FontAwesomeModule,
    NgbTooltipModule,
    QuillModule.forRoot(),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    CommentBoxComponent,
    CommentContentComponent,
    ReplyBoxComponent,
    TextCounterComponent,
    ReplyListComponent
  ],
  exports: [ CommentBoxComponent ]
})
export class PfCommentBoxModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
