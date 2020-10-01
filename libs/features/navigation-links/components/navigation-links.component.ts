import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { NavigationLinkGroup } from 'libs/models/navigation';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromOrgDataNavigationLinkActions from 'libs/features/navigation-links/actions/org-data-navigation-link.actions';
import * as fromAppNotificationsMainReducer from '../../app-notifications/reducers';
import * as fromAppNotificationsActions from '../../app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from '../../app-notifications/models';
import { Observable, Subject } from 'rxjs';
import { UserContext } from '../../../models/security';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'pf-navigation-links',
    templateUrl: './navigation-links.component.html',
    styleUrls: ['./navigation-links.component.scss']
})
export class NavigationLinksComponent implements OnInit, OnDestroy {

    @Input() navigationGroupLinks: NavigationLinkGroup[];

    private unsubscribe$ = new Subject();
    userContext: UserContext;
    userContext$: Observable<UserContext>;

    constructor(private store: Store<fromRootState.State>,
                private notificationStore: Store<fromAppNotificationsMainReducer.State>) {
      this.userContext$ = this.store.select(fromRootState.getUserContext);

      this.userContext$
        .pipe(
          filter(uc => !!uc),
          takeUntil(this.unsubscribe$)
        ).subscribe(userContext => {
        this.userContext = userContext;
      });
    }
    ngOnInit() { }

    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.unsubscribe();
    }

  handleClick($event) {
    const linkName = $event.target.innerText;
    switch (linkName) {
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
        window.open('/client/data-management/pricing-loader/pricing-loaders-download?company=' +
          encodeURIComponent(this.userContext.CompanyId + '-' + this.userContext.CompanyName) + '&companyId=' + this.userContext.CompanyId, '_blank');
        $event.preventDefault();
        }
        break;
    }
  }
}
