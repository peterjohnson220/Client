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

import * as fromFaIcons from './fa-icons';
import { GridFilterSidebarComponent } from './components/filter-panel';
import { FilterChooserComponent } from './components/filter-chooser';

@NgModule({
  imports: [
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
  declarations: [GridFilterSidebarComponent, FilterChooserComponent],
  exports: [GridFilterSidebarComponent, FilterChooserComponent]
})
export class PfGridFilterModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
