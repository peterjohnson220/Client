import { Component, Input, OnInit } from '@angular/core';

import { UserNotification, UserNotificationDisplay } from '../../models';

@Component({
  template: ''
})
export abstract class UserNotificationBaseComponent implements OnInit {
  @Input() UserNotification: UserNotification;
  UserNotificationDisplay: UserNotificationDisplay;

  ngOnInit(): void {
    this.UserNotificationDisplay = this.buildUserNotificationDisplay();
  }

  abstract buildUserNotificationDisplay(): UserNotificationDisplay;
}
