import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ToastrModule } from 'ngx-toastr';

import { reducers } from './reducers';
import { AppNotificationsComponent } from './containers';

import { ToastsEffects, UserNotificationEffects } from './effects';
import { NotificationHelper } from './models';


@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,

    // 3rd Party
    StoreModule.forFeature('feature_appnotifications', reducers),
    EffectsModule.forFeature([
      ToastsEffects,
      UserNotificationEffects
    ]),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      closeButton: true
    })
  ],
  declarations: [
    // Containers
    AppNotificationsComponent
  ],
  exports: [AppNotificationsComponent],
  providers: [ NotificationHelper ]
})
export class PfAppNotificationsModule {}
