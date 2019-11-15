import { Component, OnDestroy } from '@angular/core';

import { KeyValue } from '@angular/common';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import { EntityChoice, getEntityChoicesForOrgLoader } from '../../../models';

@Component({
  selector: 'pf-org-data-load',
  templateUrl: './org-data-load.component.html',
  styleUrls: ['./org-data-load.component.scss']
})
export class OrgDataLoadComponent implements OnDestroy {

  loadOptions: EntityChoice[];

  userMappings: KeyValue<number, string>[];

  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  userContext$: Observable<UserContext>;

  userContext: UserContext;

  // because the company selector is inside of a switch
  // the init will not fire which triggers the api call unless
  // we have rendered our index.
  stepIndex = 1;
  companies: CompanySelectorItem[];
  selectedCompany: CompanySelectorItem = null;
  hasError = false;
  selectedMapping: number;

  returnUrl = '/client/pf-admin/navigation';

  StepHeaders: string[] = [
    'Select a company:',
    'Select which organizational data entity you would like to load data for:',
    'Select and upload files:'
  ];

  NextBtnToolTips: string[] = [
    'You must choose a company',
    'Please select at least one entity to load data for.',
    'todo (verify msg text?)'
  ];

  constructor(private store: Store<fromCompanyReducer.State>) {


    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.companies$ = this.store.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.store.select(fromCompanyReducer.getSelectedCompany);

    this.selectedCompany$.subscribe(f => this.selectedCompany = f);

    const userSubscription = this.userContext$
      .pipe(
        filter(uc => !!uc),
        take(1),
        takeUntil(this.unsubscribe$)
      );

    const companiesSubscription = this.companies$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$));

    forkJoin({ user: userSubscription, company: companiesSubscription })
      .subscribe(f => {
        this.userContext = f.user;
        this.companies = f.company;
        this.setInitValues();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  setInitValues() {
    if (this.userContext.AccessLevel === 'Admin') {
      this.selectedCompany = null;
      this.stepIndex = 1;
    } else {
      this.selectedCompany = this.companies.find(f => f.CompanyId === this.userContext.CompanyId);
      this.store.dispatch(new fromCompanySelectorActions.SetSelectedCompany(this.selectedCompany));
      this.stepIndex = 2;
    }

    // reset any checked loads
    this.loadOptions = getEntityChoicesForOrgLoader();

    // TODO: reset page 3 variables always;
    this.selectedMapping = -1;
  }

  backBtnClick() {
    if (this.stepIndex === 1 || (this.stepIndex === 2 && this.userContext.AccessLevel !== 'Admin')) {
      // redirect to company admin page
      window.location.href = this.returnUrl;
      return;
    }

    if (this.stepIndex === 2) {
      this.loadOptions = getEntityChoicesForOrgLoader();
    }

    if (this.stepIndex === 3) {
      // TODO: reset step 3 here
      this.selectedMapping = -1;
    }

    this.stepIndex -= 1;
  }

  hasAtLeastOneChoice(): boolean {
    if (this.loadOptions.find(f => f.isChecked)) {
      return true;
    }
    return false;
  }

  getNextBtnOpacity(): number {
    if (!this.areStepsValid()) {
      return .65;
    }
    return 1;
  }

  areStepsValid(): boolean {
    if (this.stepIndex === 1 && (this.selectedCompany && this.selectedCompany !== null)) {
      return true;
    }

    if (this.stepIndex === 2 && this.hasAtLeastOneChoice()) {
      return true;
    }

    // TODO: when we have requirements for step 3 add here

    return false;
  }



  nextBtnClick() {
    if (this.areStepsValid()) {
      this.stepIndex += 1;
    }
  }
}
