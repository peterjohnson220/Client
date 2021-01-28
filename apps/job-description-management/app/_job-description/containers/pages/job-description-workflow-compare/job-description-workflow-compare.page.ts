import { OnInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs-compat/add/operator/take';

import { UserContext } from 'libs/models/security';
import { ControlType } from 'libs/models/common';
import * as fromRootState from 'libs/state/state';
import { CompanyDto } from 'libs/models/company';

import * as fromJobDescriptionReducer from '../../../reducers';
import * as fromCompanyLogoActions from 'libs/features/jobs/job-description-management/actions/company-logo.actions';
import * as fromJobDescriptionWorkflowCompareActions from '../../../actions/job-description-workflow-compare.actions';
import * as fromJobDescriptionManagementSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromControlTypeActions from 'libs/features/jobs/job-description-management/actions/control-types.actions';
import { JobDescriptionWorkflowCompareListItem } from '../../../models/';

@Component({
  selector: 'pf-job-description-workflow-compare.page',
  templateUrl: './job-description-workflow-compare.page.html',
  styleUrls: ['./job-description-workflow-compare.page.scss']
})
export class JobDescriptionWorkflowComparePageComponent implements OnInit, OnDestroy {
  companyLogoPath: string;
  companyName: string;

  jobDescriptionCompareList$: Observable<JobDescriptionWorkflowCompareListItem[]>;
  sourceCompareItem$: Observable<JobDescriptionWorkflowCompareListItem>;
  comparisonCompareItem$: Observable<JobDescriptionWorkflowCompareListItem>;
  jobDescriptionComparisonLoading$: Observable<boolean>;
  jobDescriptionComparisonLoadingError$: Observable<boolean>;
  jobDescriptionComparison$: Observable<any>;
  controlTypes$: Observable<ControlType[]>;
  controlTypesLoaded$: Observable<boolean>;
  identity$: Observable<UserContext>;
  company$: Observable<CompanyDto>;

  companyLogoSubscription: Subscription;
  identitySubscription: Subscription;
  compareListSubscription: Subscription;

  constructor(private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
              private store: Store<fromJobDescriptionReducer.State>,
              private router: Router, private route: ActivatedRoute,
              private userContextStore: Store<fromRootState.State>) {
    this.controlTypesLoaded$ =   this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypesLoaded);
    this.jobDescriptionCompareList$ = this.store.select(fromJobDescriptionReducer.getComparisonWorkflowListItem);
    this.sourceCompareItem$ = this.store.select(fromJobDescriptionReducer.getSourceCompareListItem);
    this.comparisonCompareItem$ = this.store.select(fromJobDescriptionReducer.getComparisonCompareListItem);
    this.jobDescriptionComparison$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionWorkflowComparison);
    this.jobDescriptionComparisonLoading$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionWorkflowComparisonLoading);
    this.jobDescriptionComparisonLoadingError$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionWorkflowComparisonLoadingError);
    this.controlTypes$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypes);
    this.company$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getCompany);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  // Events
  handleSourceVersionChanged(jobDescriptionWorkflowCompareListItem: JobDescriptionWorkflowCompareListItem) {
    this.store.dispatch(new fromJobDescriptionWorkflowCompareActions.SetSelectedSourceCompareListItem(jobDescriptionWorkflowCompareListItem));
    this.getWorkflowCompareFromSelectedVersions();
  }

  handleComparisonVersionChanged(jobDescriptionWorkflowCompareListItem: JobDescriptionWorkflowCompareListItem) {
    this.store.dispatch(new fromJobDescriptionWorkflowCompareActions.SetSelectedComparisonCompareListItem(jobDescriptionWorkflowCompareListItem));
    this.getWorkflowCompareFromSelectedVersions();
  }

  stopComparing() {
     this.router.navigate([`job-descriptions/${this.route.snapshot.params.id}`], { queryParamsHandling: 'preserve' });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobDescriptionWorkflowCompareActions.LoadCompareList(this.route.snapshot.params.id));

    // Get Identity
    this.identitySubscription = this.identity$.subscribe(identity => {
      this.companyLogoSubscription = this.company$.subscribe((company) => {
        this.companyLogoPath = company
          ? identity.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + company.CompanyLogo
          : '';
        if (company) {
          this.companyName = company.CompanyName;
        }
      });

      this.sharedStore.dispatch(new fromCompanyLogoActions.LoadCompanyLogo(identity.CompanyId));
    });

    this.compareListSubscription = this.jobDescriptionCompareList$.subscribe((compareList) => {
      if (compareList) {
        this.store.dispatch(new fromJobDescriptionWorkflowCompareActions.LoadCompareListSuccess(compareList));
        this.getWorkflowCompareFromSelectedVersions();
      }
    });

    // Get all control types
    this.store.dispatch(new fromControlTypeActions.LoadControlTypes());
  }

  private getWorkflowCompareFromSelectedVersions() {
    forkJoin([this.sourceCompareItem$.take(1), this.comparisonCompareItem$.take(1)]).subscribe(result => {

      if (result[0] && result[1]) {
        const sourceStepNumber = result[0].StepNumber;
        const sourceAbsoluteIterationNumber = result[0].AbsoluteIterationNumber;
        const comparisonStepNumber = result[1].StepNumber;
        const comparisonAbsoluteIterationNumber = result[1].AbsoluteIterationNumber;

        this.store.dispatch(new fromJobDescriptionWorkflowCompareActions.LoadingJobDescriptionComparison({
          jobDescriptionId: this.route.snapshot.params.id,
          sourceStepNumber: sourceStepNumber,
          sourceAbsoluteIterationNumber: sourceAbsoluteIterationNumber,
          comparisonStepNumber: comparisonStepNumber,
          comparisonAbsoluteIterationNumber: comparisonAbsoluteIterationNumber}));
      }
    });
  }

  ngOnDestroy(): void {
    this.companyLogoSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
  }

}
