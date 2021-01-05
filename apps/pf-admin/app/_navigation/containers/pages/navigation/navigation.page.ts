import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromNavigationActions from 'libs/features/infrastructure/admin-navigation-links/actions/navigation.actions';
import * as fromNavigationReducer from 'libs/features/infrastructure/admin-navigation-links/reducers';
import { NavigationLinkGroup } from 'libs/models/navigation';

@Component({
    selector: 'pf-admin-navigation',
    templateUrl: './navigation.page.html',
    styleUrls: ['./navigation.page.scss']
})
export class NavigationPageComponent implements OnInit {
    navigationLinkGroups$: Observable<NavigationLinkGroup[]>;
    navigationLinkGroupsLoading$: Observable<boolean>;
    navigationLinkGroupsLoadingError$: Observable<boolean>;

    constructor(private store: Store<fromNavigationReducer.State>) {
        this.navigationLinkGroupsLoading$ = this.store.select(fromNavigationReducer.getNavigationLinksLoading);
        this.navigationLinkGroupsLoadingError$ = this.store.select(fromNavigationReducer.getNavigationLinksLoadingError);
        this.navigationLinkGroups$ = this.store.select(fromNavigationReducer.getAdminLinks);
    }

    ngOnInit() {
        this.store.dispatch(new fromNavigationActions.LoadNavigationLinks('site-admin'));
    }
}
