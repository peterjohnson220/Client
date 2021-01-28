import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserNotificationDisplay } from '../../models';
import { UserNotificationEventHelperService } from '../../helpers/user-notification-event-helper-service';
import * as fromUserNotificationListReducers from '../../reducers';
import * as fromUserNotificationListActions from '../../actions/user-notification-list.actions';

@Component({
  selector: 'pf-user-notification-display',
  templateUrl: './user-notification-display.component.html',
  styleUrls: ['./user-notification-display.component.scss']
})
export class UserNotificationDisplayComponent {

  @Input() UserNotificationDisplay: UserNotificationDisplay;
  constructor(private userNotificationEventHelperService: UserNotificationEventHelperService,
              private store: Store<fromUserNotificationListReducers.State>) { }

  onClicked() {
    this.UserNotificationDisplay.IsRead = true;
  }

  closePopover() {
    if (this.UserNotificationDisplay.IsRead) {
      this.userNotificationEventHelperService.closePopoverEvent();
    } else {
      this.store.dispatch(new fromUserNotificationListActions.MarkNotificationRead({userNotificationId: this.UserNotificationDisplay.Id, closePopover: true}));
    }
  }
}
