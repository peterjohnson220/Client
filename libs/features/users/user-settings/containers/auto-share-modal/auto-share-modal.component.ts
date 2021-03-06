import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { InputDebounceComponent } from 'libs/forms/components/input-debounce';
import { ShareModalOperation } from 'libs/models/share-modal/share-modal-operation';

import * as fromAutoShareActions from '../../actions/auto-share.actions';
import * as fromAutoShareReducer from '../../reducers';
import * as fromProjectListActions from '../../../../../../apps/project/app/_project-list/actions';
import * as fromRootState from '../../../../../state/state';
import { AsyncStateObj } from '../../../../../models/state';
import { AutoShareUser } from '../../../../../models/user-settings';
import { UserContext } from '../../../../../models/security';


@Component({
  selector: 'pf-auto-share-modal',
  templateUrl: './auto-share-modal.component.html',
  styleUrls: ['./auto-share-modal.component.scss']
})
export class AutoShareModalComponent implements OnInit, OnDestroy {
  @Input() modalOperation: ShareModalOperation = ShareModalOperation.SaveAutoShareUsers;

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
  submitEnabled: boolean;

  autoShareOperation = ShareModalOperation;

  emailForm: FormGroup;
  get f() { return this.emailForm.controls; }

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromAutoShareReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
    this.showAutoShareModal$ = this.store.pipe(select(fromAutoShareReducer.getShowAutoShareModal));
    this.shareableUsersAsync$ = this.store.pipe(select(fromAutoShareReducer.getSharableUsersAsync));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromAutoShareActions.GetShareableUsers());

    this.emailForm = this.formBuilder.group({
      CustomEmailMessage: ['', []]
    });

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
        this.submitEnabled = false;
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
    if (!isEqual(this.shareableUsers, this.originalShareableUsers)) {
      switch (this.modalOperation) {
        case this.autoShareOperation.BulkProjectShare : {
          this.store.dispatch(new fromProjectListActions.BulkProjectShare (
            {UserIds: selectedUserIds}, this.f.CustomEmailMessage.value));
          break;
        }
        case this.autoShareOperation.SaveAutoShareUsers : {
          this.store.dispatch(new fromAutoShareActions.SaveAutoShareUsers({UserIds: selectedUserIds}));
          break;
        }
      }
    }
    this.handleModalDismissed();
  }

  handleModalDismissed() {
    this.shareableUsers = cloneDeep(this.originalShareableUsers);
    this.searchValue = '';
    this.inputDebounceComponent.clearValue();
    this.emailForm.patchValue({
      CustomEmailMessage: ''
    });
    this.store.dispatch(new fromAutoShareActions.CloseAutoShareModal());
  }

  handleToggleSelectedUser(user: AutoShareUser) {
    const match = this.shareableUsers.find(u => u.UserId === user.UserId);
    match.IsSelected = user.IsSelected;
    this.submitEnabled = true;
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
      this.filteredShareableUsers = this.shareableUsers.filter(su => su.FullName.toLowerCase().includes(this.searchValue));
    } else {
      this.filteredShareableUsers = this.shareableUsers;
    }
  }

}
