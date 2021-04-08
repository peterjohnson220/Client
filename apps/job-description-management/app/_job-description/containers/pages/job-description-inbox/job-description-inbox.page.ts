import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromJobDescriptionInboxReducer from '../../../reducers';
import * as fromJobDescriptionInboxActions from '../../../actions/job-description-inbox.actions';


@Component({
    selector: 'pf-job-description-inbox-page',
    templateUrl: './job-description-inbox.page.html',
    styleUrls: ['./job-description-inbox.page.scss']
})

export class JobDescriptionInboxPageComponent implements OnDestroy, OnInit {
    inboxSelectAllPages: boolean;
    inboxSelectAllPages$: Observable<boolean>;
    inboxSelectAllPagesSub: Subscription;
    markReadSaving$: Observable<boolean>;
    markUnreadSaving$: Observable<boolean>;
    selectedIds$: Observable<Set<number>>;
    unreadCount$: Observable<number>;
    unreadCountError$: Observable<boolean>;

    constructor(private store: Store<fromJobDescriptionInboxReducer.State>) {}

    ngOnDestroy(): void {
        this.inboxSelectAllPagesSub.unsubscribe();
    }

    ngOnInit(): void {
        this.inboxSelectAllPages$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxSelectAllPages));
        this.markReadSaving$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getMarkReadSaving));
        this.markUnreadSaving$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getMarkUnreadSaving));
        this.selectedIds$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getSelectedIds));
        this.unreadCount$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getUnreadInboxCount));
        this.unreadCountError$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getUnreadInboxCountError));

        this.inboxSelectAllPagesSub = this.inboxSelectAllPages$.subscribe((selectAll) => {
            this.inboxSelectAllPages = selectAll;
        });

        this.store.dispatch(new fromJobDescriptionInboxActions.LoadInbox());
        this.store.dispatch(new fromJobDescriptionInboxActions.GetUnreadInboxCount());
    }

    onClearSelections() {
        this.store.dispatch(new fromJobDescriptionInboxActions.UnselectAll());
    }

    onMarkRead() {
        if (this.inboxSelectAllPages) {
            this.store.dispatch(new fromJobDescriptionInboxActions.UpdateInboxReadAll(true));
        } else {
            this.store.dispatch(new fromJobDescriptionInboxActions.UpdateInboxReadBulk(true));
        }
      }

    onMarkUnread() {
        if (this.inboxSelectAllPages) {
            this.store.dispatch(new fromJobDescriptionInboxActions.UpdateInboxReadAll(false));
        } else {
            this.store.dispatch(new fromJobDescriptionInboxActions.UpdateInboxReadBulk(false));
        }
    }
}
