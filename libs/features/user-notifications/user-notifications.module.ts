import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';

import { reducers } from './reducers';
import { UserNotificationListComponent } from './containers';
import { UserNotificationContainerComponent } from './containers/user-notification-container/user-notification-container.component';
import { UserTicketNotificationComponent } from './containers/categories/user-ticket/user-ticket-notification.component';
import { UserNotificationDisplayComponent } from './containers/user-notification-display/user-notification-display.component';
import { RoutedJobDescriptionNotificationComponent } from './containers/categories/routed-job-description/routed-job-description-notification.component';
import {
  JobDescriptionReviewCompleteNotificationComponent
} from './containers/categories/job-description-review-complete/job-description-review-complete-notification.component';
import {
  JobDescriptionReviewRejectedNotificationComponent
} from './containers/categories/job-description-review-rejected/job-description-review-rejected-notification.component';
import { CompanyResourcesNotificationComponent } from './containers/categories/company-resources/company-resources-notification.component';
import { CommunityPostsNotificationComponent } from './containers/categories/community-posts/community-posts-notification.component';
import { UserNotificationListEffects } from './effects';
import { UserNotificationHostDirective } from './directives';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    CommonModule,

    // Payfactors
    PfFormsModule,
    PfCommonModule,

    // 3rd party
    StoreModule.forFeature('feature_user_notifications', reducers),
    EffectsModule.forFeature([UserNotificationListEffects]),
    FontAwesomeModule
  ],
  declarations: [
    // Directives:
    UserNotificationHostDirective,

    // Components:
    UserNotificationListComponent,
    UserNotificationContainerComponent,
    UserTicketNotificationComponent,
    UserNotificationDisplayComponent,
    RoutedJobDescriptionNotificationComponent,
    JobDescriptionReviewCompleteNotificationComponent,
    JobDescriptionReviewRejectedNotificationComponent,
    CompanyResourcesNotificationComponent,
    CommunityPostsNotificationComponent
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
