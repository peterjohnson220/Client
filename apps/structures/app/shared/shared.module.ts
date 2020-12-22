import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import * as fromFaIcons from './fa-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';




import { reducers } from './reducers';
import { RangeGroupExistsGuard } from './guards';
import { RangeValuePipe } from './pipes';


@NgModule({
    imports: [
        // Angular
        CommonModule,
        RouterModule,

        // 3rd Party
        StoreModule.forFeature('structures_shared', reducers)

    ],
  declarations: [
    RangeValuePipe
  ],
  exports: [
    FontAwesomeModule,
    RangeValuePipe
  ],
  providers: [
    RangeGroupExistsGuard
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
