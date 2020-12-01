import cloneDeep from 'lodash/cloneDeep';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { InputDebounceComponent } from 'libs/forms/components/input-debounce';

import * as fromAutoShareActions from '../../actions/auto-share.actions';
import * as fromAutoShareReducer from '../../reducers';
import * as fromRootState from '../../../../state/state';
import { AsyncStateObj } from '../../../../models/state';
import { AutoShareUser } from '../../../../models/user-settings';
import { UserContext } from '../../../../models/security';

@Component({
  selector: 'pf-auto-share-modal',
  templateUrl: './auto-share-modal.component.html',
  styleUrls: ['./auto-share-modal.component.scss']
})
export class AutoShareModalComponent implements OnInit, OnDestroy {
  @ViewChild(InputDebounceComponent, { static: true }) public inputDebounceComponent: InputDebounceComponent;

  // observables
  userContext$: Observable<UserContext>;
  showAutoShareModal$: Observable<boolean>;
  shareableUsersAsync$: Observable<AsyncStateObj<AutoShareUser[]>>;

  // subscriptions
  userContextSubscription: Subscription;
  shareableUsersAsyncSubscription: Subscription;
  showAutoShareModalSubscription: Subscription;

  avatarUrl: string;
  searchValue: string;
  shareableUsers: AutoShareUser[];
  originalShareableUsers: AutoShareUser[];
  filteredShareableUsers: AutoShareUser[];

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromAutoShareReducer.State>
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
    this.showAutoShareModal$ = this.store.pipe(select(fromAutoShareReducer.getShowAutoShareModal));
    this.shareableUsersAsync$ = this.store.pipe(select(fromAutoShareReducer.getSharableUsersAsync));
  }

  ngOnInit(): void {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.avatarUrl = uc.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });
    this.shareableUsersAsyncSubscription = this.shareableUsersAsync$.subscribe(u => {
      this.shareableUsers = cloneDeep(u.obj);
      this.originalShareableUsers = cloneDeep(u.obj);
    });
    this.showAutoShareModalSubscription = this.showAutoShareModal$.subscribe(showModal => {
      if (showModal) {
        this.searchValue = '';
        this.filteredShareableUsers = this.shareableUsers;
      }
    });
  }

  ngOnDestroy(): void {
    this.userContextSubscription.unsubscribe();
    this.shareableUsersAsyncSubscription.unsubscribe();
    this.showAutoShareModalSubscription.unsubscribe();
  }
  get autoShareUsersSelected(): number {
    return this.shareableUsers.filter(x => x.IsSelected === true).length;
  }

  handleOnSubmit() {
    const selectedUserIds = this.shareableUsers.filter(u => u.IsSelected === true).map(x => x.UserId);
    if (selectedUserIds.length) {
      this.store.dispatch(new fromAutoShareActions.SaveAutoShareUsers(selectedUserIds));
    }
    this.handleModalDismissed();
  }

  handleModalDismissed() {
    this.shareableUsers = cloneDeep(this.originalShareableUsers);
    this.searchValue = '';
    this.inputDebounceComponent.clearValue();
    this.store.dispatch(new fromAutoShareActions.CloseAutoShareModal());
  }

  handleToggleSelectedUser(user: AutoShareUser) {
    const match = this.shareableUsers.find(u => u.UserId === user.UserId);
    match.IsSelected = user.IsSelected;
  }

  handleSearchValueChanged(value: string) {
    this.searchValue = value.toLowerCase();
    this.applySearchFilterList();
  }

  trackByFn(index: any, user: AutoShareUser) {
    return user.UserId;
  }

  private applySearchFilterList(): void {
    if (!!this.searchValue && !!this.searchValue.length) {
      this.filteredShareableUsers = this.shareableUsers.filter(su =>
        su.FirstName.toLowerCase().includes(this.searchValue) || su.LastName.toLowerCase().includes(this.searchValue));
    } else {
      this.filteredShareableUsers = this.shareableUsers;
    }
  }

}
