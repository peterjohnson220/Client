import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class UserNotificationEventHelperService {
  private closePopover = new Subject;

  closePopover$ = this.closePopover.asObservable();

  closePopoverEvent() {
    this.closePopover.next();
  }
}
