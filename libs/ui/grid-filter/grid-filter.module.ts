import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';

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
    // Angular
    CommonModule,
    NgbTooltipModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,

    // Third Party
    DropDownListModule,
    LayoutModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
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
