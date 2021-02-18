import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { PfFormsModule } from 'libs/forms';

import { AutoShareModalComponent, AutoSharedUsersComponent } from './containers';
import { ShareableUserComponent } from './components';
import { reducers } from './reducers';
import { AutoShareEffects } from './effects';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    CommonModule,
    // Payfactors
    PfFormsModule,

    // 3rd party
    StoreModule.forFeature('userSettingsShared_main', reducers),
    EffectsModule.forFeature([AutoShareEffects]),
    FontAwesomeModule,
    ImgFallbackModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
  ],
  declarations: [

    // Components:
    AutoShareModalComponent,
    AutoSharedUsersComponent,
    ShareableUserComponent
    ],
  exports: [
    AutoShareModalComponent,
    AutoSharedUsersComponent
  ]
})
export class PfUserSettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
