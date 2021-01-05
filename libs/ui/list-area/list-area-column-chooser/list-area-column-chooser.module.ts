import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ListAreaColumnChooserComponent } from './list-area-column-chooser';
import * as fromFaIcons from './fa-icons';



@NgModule({
  declarations: [
    ListAreaColumnChooserComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule
  ],
  exports: [
    ListAreaColumnChooserComponent
  ]
})
export class PfListAreaColumnChooserModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
