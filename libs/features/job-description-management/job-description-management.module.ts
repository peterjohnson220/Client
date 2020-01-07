import { NgModule } from '@angular/core';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    FontAwesomeModule
  ],  declarations: [],
  exports: []
})
export class PfJobDescriptionManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
