import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { ColumnChooserComponent } from './column-chooser.component';
import { ColumnSearchPipe } from './pipes';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule,
    PfCommonModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    ScrollingModule,
    PfFormsModule,
    PfCommonUIModule
  ],
  declarations: [ColumnChooserComponent, ColumnSearchPipe],
  exports: [ColumnChooserComponent, ColumnSearchPipe]
})
export class PfColumnChooserModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
