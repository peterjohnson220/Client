import { Component, OnDestroy, ViewChild } from '@angular/core';

import { KeyValue } from '@angular/common';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import { EntityChoice, getEntityChoicesForOrgLoader, OrgUploadStep } from '../../../models';
import { EntityUploadComponent } from '../../../components';

@Component({
  selector: 'pf-org-data-load',
  templateUrl: './org-data-load.component.html',
  styleUrls: ['./org-data-load.component.scss']
})

export class OrgDataLoadComponent implements OnDestroy {

  @ViewChild('entityUpload', { static: false }) uploadComponent: EntityUploadComponent;
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
  stepIndex: OrgUploadStep = OrgUploadStep.Company;
  stepEnum = OrgUploadStep;
  companies: CompanySelectorItem[];
  selectedCompany: CompanySelectorItem = null;
  hasError = false;
  selectedMapping: number;

  // TODO: before this is finalized find a better way than hardcoding this, DB?
  returnUrl = '/client/pf-admin/navigation';

  StepHeaders: string[] = [
    'Select a company:',
    'Select which organizational data entity you would like to load data for:',
    'Select and upload files:'
  ];

  NextBtnToolTips: string[] = [
    'You must choose a company',
    'Please select at least one entity to load data for.',
    'Please choose a file for each entity type'
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
      this.stepIndex = OrgUploadStep.Company;
    } else {
      this.selectedCompany = this.companies.find(f => f.CompanyId === this.userContext.CompanyId);
      this.store.dispatch(new fromCompanySelectorActions.SetSelectedCompany(this.selectedCompany));
      this.stepIndex = OrgUploadStep.Entity;
    }

    // reset any checked loads
    this.loadOptions = getEntityChoicesForOrgLoader();

    this.selectedMapping = -1;
  }

  goBack() {

    this.clearSelections();
    if (this.stepIndex === OrgUploadStep.Company || (this.stepIndex === OrgUploadStep.Entity && this.userContext.AccessLevel !== 'Admin')) {
      // redirect to company admin page
      window.location.href = this.returnUrl;
      return;
    }

    this.stepIndex -= 1;
  }

  clearSelections() {

    switch (this.stepIndex) {
      case OrgUploadStep.Company:
        this.selectedCompany = null;
        break;

      case OrgUploadStep.Entity:
        this.loadOptions.forEach(element => {
          element.isChecked = false;
        });
        break;

      case OrgUploadStep.Files:
        this.loadOptions.forEach(element => {
          element.File = null;
        });

        this.uploadComponent.ClearAllFiles();
        break;

      case OrgUploadStep.FieldMapping:

        // TODO placeholder for next story
        break;

      default:
        break;
    }
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
    if (this.stepIndex === OrgUploadStep.Company && (this.selectedCompany && this.selectedCompany !== null)) {
      return true;
    }

    if (this.stepIndex === OrgUploadStep.Entity && this.hasAtLeastOneChoice()) {
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
