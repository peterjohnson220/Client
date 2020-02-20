import { Component, OnDestroy, OnInit } from '@angular/core';

import { cloneDeep, isObject } from 'lodash';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { environment } from 'environments/environment';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import { UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { EmployeeKeyStep } from './employee-key-step.enum';
import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromEntityIdentifierActions from '../../../actions/entity-identifier.actions';
import { FieldNames } from '../../../models/constants';
import { EntityIdentifierViewModel } from '../../../models/entity-identifiers-view.model';

@Component({
  selector: 'pf-custom-employee-identifier',
  templateUrl: './custom-employee-identifier.component.html',
  styleUrls: ['./custom-employee-identifier.component.scss']
})

export class CustomEmployeeIdentifierComponent implements OnDestroy, OnInit {

  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  private hasSaved$: Observable<boolean>;

  private userContext: UserContext;
  private env = environment;
  private companies: CompanySelectorItem[];

  isCustomField = false;
  selectedCompany: CompanySelectorItem = null;
  step: EmployeeKeyStep;
  stepEnum = EmployeeKeyStep;
  employeeFields$: Observable<any>;
  isFetchingData$: Observable<boolean>;
  hasFetchingError$: Observable<boolean>;
  employeeFields: EntityIdentifierViewModel[] = [];

  initValues() {
    this.step = this.stepEnum.Company;

    if (this.userContext.AccessLevel === 'Admin') {
      this.mainStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
      this.step = this.stepEnum.Company;
    } else {
      this.selectedCompany = this.companies.find(f => f.CompanyId === this.userContext.CompanyId);
      this.mainStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(this.selectedCompany));
      this.step = this.stepEnum.Fields;
    }
  }

  constructor(private mainStore: Store<fromDataManagementMainReducer.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>) {

    this.selectedCompany$ = this.mainStore.select(fromCompanyReducer.getSelectedCompany);
    this.companies$ = this.mainStore.select(fromCompanyReducer.getCompanies);
    this.employeeFields$ = this.mainStore.select(fromDataManagementMainReducer.getEmployeeIdentifiers);
    this.isFetchingData$ = this.mainStore.select(fromDataManagementMainReducer.isFetchingEntityIdData);
    this.hasFetchingError$ = this.mainStore.select(fromDataManagementMainReducer.hasEntityIdDataError);
    this.hasSaved$ = this.mainStore.select(fromDataManagementMainReducer.hasSavedEntityIdData);

    this.hasSaved$.pipe(
      filter(f => !!f),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      if (f === true) {
        const notification = {
          NotificationId: '',
          Level: NotificationLevel.Info,
          From: NotificationSource.GenericNotificationMessage,
          Payload: {
            Title: 'Employee Key Fields Saved Successfully'
          },
          EnableHtml: true,
          Type: NotificationType.Event
        };

        this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
      }
    });


    this.employeeFields$.pipe(
      filter(r => !!r),
      takeUntil(this.unsubscribe$)
    ).subscribe(response => {
      const selected = response.filter(a => a.isChecked);
      if (selected && selected.length === 1 && selected.findIndex(a => a.Field === FieldNames.EMPLOYEE_ID) > -1) {
        this.isCustomField = false;
      } else {
        this.isCustomField = true;
      }
      this.employeeFields = cloneDeep(response);
    });

    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      if (f) {
        this.refreshIdentifiers();
      }
    });

    const userSubscription = this.mainStore.select(fromRootState.getUserContext).pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$));

    const companiesSubscription = this.companies$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$));

    forkJoin({ user: userSubscription, company: companiesSubscription })
      .subscribe(f => {
        this.userContext = f.user;
        this.companies = f.company;
        this.initValues();
      });
  }

  ngOnInit(): void {
    this.mainStore.dispatch(new fromCompanySelectorActions.GetCompanies());
  }

  companySelected() {
    if (this.areStepsValid()) {
      this.step++;
    }
  }

  checkboxChanged($event: boolean, currentItem: EntityIdentifierViewModel) {
    const allSelected = this.employeeFields.filter(f => f.isChecked === true);
    if ($event && allSelected && allSelected.length >= 4) {
      confirm('You may select a maximum of 4 fields');
    } else {
      const currentField = this.employeeFields.find(f => f.Field === currentItem.Field);
      currentField.isChecked = $event;
    }
  }

  submitChanges() {
    if (!this.isCustomField) {
      // anything not employee gets unchecked
      this.employeeFields.filter(f => f.Field !== FieldNames.EMPLOYEE_ID).forEach(f => f.isChecked = false);
    }

    const selectedFields = this.employeeFields.filter(f => f.isChecked).map(f => f.Field);
    this.mainStore.dispatch(new fromEntityIdentifierActions.PutEmployeeIdentifiers(this.selectedCompany.CompanyId, selectedFields));
  }

  refreshIdentifiers() {
    this.mainStore.dispatch(new fromEntityIdentifierActions.GetEmployeeIdentifiers(this.selectedCompany.CompanyId));
  }

  areStepsValid(): boolean {

    switch (this.step) {
      case EmployeeKeyStep.Company:
        return isObject(this.selectedCompany);
      case EmployeeKeyStep.Fields:
        if (!this.employeeFields || this.employeeFields.length === 0) {
          return false;
        }

        const selectedItems = this.employeeFields.filter(f => f.isChecked === true);

        return (
          selectedItems.length > 0 &&
          selectedItems.findIndex(f => f.Field === FieldNames.EMPLOYEE_ID) > -1 &&
          selectedItems.length <= 4
        );
      default:
        break;

    }
  }

  getNextBtnOpacity(): number {
    if (!this.areStepsValid()) {
      return .65;
    }
    return 1;
  }

  goBack() {

    if (this.step === EmployeeKeyStep.Company) {
      window.location.href = this.env.siteAdminUrl;
      return;
    }

    if (this.step === EmployeeKeyStep.Fields && this.userContext.AccessLevel !== 'Admin') {
      window.location.href = this.env.companyAdminUrl;
      return;
    }

    this.step -= 1;
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }
}


