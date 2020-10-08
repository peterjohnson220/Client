import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { reducers } from './reducers';
import { UserNotificationListComponent } from './containers';
import { PfFormsModule } from '../../forms';
import { UserNotificationListEffects } from './effects';
import { UserNotificationComponent } from './containers/user-notification/user-notification.component';
import * as fromFaIcons from './fa-icons';


@NgModule({
  imports: [
    CommonModule,
    // 3rd Party
    StoreModule.forFeature('feature_user_notifications', reducers),
    EffectsModule.forFeature([UserNotificationListEffects]),
    PfFormsModule,
    FontAwesomeModule,

  ],
  declarations: [
    UserNotificationListComponent,
    UserNotificationComponent
  ],
  exports: [
    UserNotificationListComponent
  ]
})
export class PfUserNotificationsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
