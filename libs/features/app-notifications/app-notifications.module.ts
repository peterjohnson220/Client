import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';

import { reducers } from './reducers';
import { AppNotificationsComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,

    // 3rd Party
    StoreModule.forFeature('feature_appnotifications', reducers),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      closeButton: true
    })
  ],
  declarations: [
    // Containers
    AppNotificationsComponent
  ],
  exports: [AppNotificationsComponent]
})
export class PfAppNotificationsModule {}
