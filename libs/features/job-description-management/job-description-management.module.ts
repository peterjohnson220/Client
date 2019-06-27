import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    FontAwesomeModule
  ],  declarations: [],
  exports: []
})
export class PfJobDescriptionManagementModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
