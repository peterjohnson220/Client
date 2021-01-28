import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromNavigationActions from 'libs/features/infrastructure/admin-navigation-links/actions/navigation.actions';
import * as fromNavigationViewReducer from 'libs/features/infrastructure/admin-navigation-links/reducers';

import { NavigationLinkGroup } from 'libs/models/navigation';

@Component({
    selector: 'pf-navigation-page',
    templateUrl: './navigation.page.html',
    styleUrls: ['./navigation.page.scss']
})

export class NavigationPageComponent implements OnInit {
    navigationLinks$: Observable<NavigationLinkGroup[]>;
    navigationLinksLoading$: Observable<boolean>;
    navigationLinksLoadingError$: Observable<boolean>;

    constructor(private store: Store<fromNavigationViewReducer.State>) {
        this.navigationLinks$ = this.store.select(fromNavigationViewReducer.getAdminLinks);
        this.navigationLinksLoading$ = this.store.select(fromNavigationViewReducer.getNavigationLinksLoading);
        this.navigationLinksLoadingError$ = this.store.select(fromNavigationViewReducer.getNavigationLinksLoadingError);
    }

    ngOnInit() {
        this.store.dispatch(new fromNavigationActions.LoadNavigationLinks('company-admin'));
    }
}
