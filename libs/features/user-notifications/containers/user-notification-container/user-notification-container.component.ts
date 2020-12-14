import { Component, ComponentFactory, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';

import { UserTicketNotificationComponent } from '../categories/user-ticket/user-ticket-notification.component';
import { UserNotificationBaseComponent } from '../user-notification-base/user-notification-base.component';
import { RoutedJobDescriptionNotificationComponent } from '../categories/routed-job-description/routed-job-description-notification.component';
import {
  JobDescriptionReviewCompleteNotificationComponent
} from '../categories/job-description-review-complete/job-description-review-complete-notification.component';
import { UserNotification } from '../../models';
import { UserNotificationHostDirective } from '../../directives';
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

      case UserNotificationConstants.ROUTED_JOB_DESCRIPTION_LOOKUP_KEY:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RoutedJobDescriptionNotificationComponent);
        break;

      case UserNotificationConstants.JOB_DESCRIPTION_REVIEW_COMPLETE_LOOKUP_KEY:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(JobDescriptionReviewCompleteNotificationComponent);
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
