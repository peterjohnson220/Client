import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SubsidiaryInfo, UserAssignedRole, UserContext } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';
import { RouteTrackingService } from 'libs/core';

import * as fromUserActions from '../actions/user-management.actions';
import * as fromUserReducer from '../reducers';

@Component({
  selector: 'pf-user-page',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss']
})
export class UserPageComponent implements OnInit, OnDestroy {
  userId: number;
  companyId: number;

  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  user$: Observable<UserManagementDto>;
  userRoles$: Observable<UserAssignedRole[]>;
  apiError$: Observable<string>;
  userContext$: Observable<UserContext>;
  companySubsidiaryInfo$: Observable<SubsidiaryInfo[]>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private store: Store<fromUserReducer.State>,
    private routeTrackingService: RouteTrackingService
  ) {
    this.loading$ = this.store.select(fromUserReducer.getUserStateLoading);
    this.loaded$ = this.store.select(fromUserReducer.getUserStateLoaded);
    this.apiError$ = this.store.select(fromUserReducer.getUserStateApiError);

    this.user$ = this.store.select(fromUserReducer.getUserStateUser);
    this.userRoles$ = this.store.select(fromUserReducer.getUserStateRoles);

    this.companySubsidiaryInfo$ = this.store.select(fromUserReducer.getCompanySubsidiaryInfo);
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params.userId;
    if (this.userId) {
      this.store.dispatch(new fromUserActions.LoadUser(this.userId));
    } else {
      this.store.dispatch(new fromUserActions.ResetUser());
    }

    this.companyId = this.route.snapshot.params.companyId;
    this.store.dispatch(new fromUserActions.LoadRoles(this.companyId));
    this.store.dispatch(new fromUserActions.LoadCompanySubsidiaryInfo({CompanyId: this.companyId}));
  }

  ngOnDestroy() {
    this.store.dispatch(new fromUserActions.ResetState());
  }

  save(user: UserManagementDto) {
    this.store.dispatch(new fromUserActions.SaveUser(user));
  }

  handleCancel() {
    this.routeTrackingService.goBack();
  }

  reloadPage() {
    window.location.reload();
  }
}
