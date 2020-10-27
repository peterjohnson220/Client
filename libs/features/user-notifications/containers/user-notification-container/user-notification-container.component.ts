import { Component, ComponentFactory, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';

import { UserNotification } from '../../models';
import { UserNotificationHostDirective } from '../../directives';
import { UserTicketNotificationComponent } from '../categories/user-ticket/user-ticket-notification.component';
import { UserNotificationBaseComponent } from '../user-notification-base/user-notification-base.component';
import { UserNotificationConstants } from '../../constants';

@Component({
  selector: 'pf-user-notification-container',
  templateUrl: './user-notification-container.component.html',
  styleUrls: ['./user-notification-container.component.scss']
})
export class UserNotificationContainerComponent  implements OnInit {
  @ViewChild(UserNotificationHostDirective, {static: true}) notificationHost: UserNotificationHostDirective;
  @Input() UserNotification: UserNotification;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
   this.loadComponent();
  }

  loadComponent() {
    let componentFactory: ComponentFactory<UserNotificationBaseComponent>;

    switch (this.UserNotification.LookupKey) {
      case UserNotificationConstants.USER_TICKET_LOOKUP_KEY:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserTicketNotificationComponent);
        break;

      default:
        break;
    }

    if (!!componentFactory) {
      const viewContainerRef = this.notificationHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent<any>(componentFactory);
      componentRef.instance.UserNotification = this.UserNotification;
    }
  }
}
