import { Component, Input, OnInit } from '@angular/core';

import { NavigationLinkGroup } from 'libs/models/navigation';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromOrgDataNavigationLinkActions from 'libs/features/infrastructure/navigation-links/actions/org-data-navigation-link.actions';
import * as fromAppNotificationsMainReducer from '../../app-notifications/reducers';
import * as fromAppNotificationsActions from '../../app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from '../../app-notifications/models';

@Component({
    selector: 'pf-navigation-links',
    templateUrl: './navigation-links.component.html',
    styleUrls: ['./navigation-links.component.scss']
})
export class NavigationLinksComponent implements OnInit {

    @Input() navigationGroupLinks: NavigationLinkGroup[];

    constructor(private store: Store<fromRootState.State>,
                private notificationStore: Store<fromAppNotificationsMainReducer.State>) { }
    ngOnInit() { }

  handleClick($event) {
    const linkName = $event.target.innerText;

    switch (linkName.trim()) {
      case 'Download Organizational Data': {
          const notification = {
            NotificationId: '',
            Level: NotificationLevel.Info,
            From: NotificationSource.GenericNotificationMessage,
            Payload: {
              Title: 'Please wait while your file is built'
            },
            EnableHtml: true,
            Type: NotificationType.Event
          };
          this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
          this.store.dispatch(new fromOrgDataNavigationLinkActions.InitiateOrgDataExport());
          $event.preventDefault();
        }
        break;
      case 'Download Pricing Data': {
          window.open('/client/data-management/pricing-loader/pricing-loaders-download', '_blank');
          $event.preventDefault();
        }
        break;
    }
  }
}
