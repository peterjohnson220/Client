import { Component, Input, OnInit } from '@angular/core';

import { NavigationLinkGroup } from 'libs/models/navigation';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromOrgDataNavigationLinkActions from 'libs/features/navigation-links/actions/org-data-navigation-link.actions';

@Component({
    selector: 'pf-navigation-links',
    templateUrl: './navigation-links.component.html',
    styleUrls: ['./navigation-links.component.scss']
})
export class NavigationLinksComponent implements OnInit {

    @Input() navigationGroupLinks: NavigationLinkGroup[];

    constructor(private store: Store<fromRootState.State>) { }
    ngOnInit() { }

  handleClick($event) {
    const linkName = $event.target.innerText;

    if (linkName === 'Download Organizational Data') {
      this.store.dispatch(new fromOrgDataNavigationLinkActions.InitiateOrgDataExport());
      $event.preventDefault();
    }
  }
}
