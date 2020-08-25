import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CompanyJob, Template } from 'libs/models';

import * as fromTemplateActions from '../../../actions';
import * as fromTemplateReducers from '../../../reducers';
import { CompanyJobSearchPipe } from '../../../pipes';
import * as fromSharedJdmState from 'libs/features/job-description-management/reducers';
import * as fromJobFamilyActions from 'libs/features/job-description-management/actions/job-family.actions';

@Component({
  selector: 'pf-assign-template-to-job-modal',
  templateUrl: './assign-template-to-job-modal.component.html',
  styleUrls: ['./assign-template-to-job-modal.component.scss']
})
export class AssignTemplateToJobModalComponent implements OnInit, OnDestroy {

  @ViewChild('assignModal', {static: true}) public assignModal: any;

  public jobFamilies$: Observable<string[]>;
  public jobFamiliesLoadingError$: Observable<boolean>;
  public jobFamiliesLoadingErrorMessage$: Observable<string>;
  public companyJobsWithNoTemplateLoading$: Observable<boolean>;
  public selectedCompanyJobIdsWithNoTemplate$: Observable<number[]>;
  public companyJobsWithTemplateLoading$: Observable<boolean>;
  public selectedCompanyJobIdsWithTemplate$: Observable<number[]>;
  public saving$: Observable<boolean>;
  public saveError$: Observable<boolean>;
  public saveErrorMessage$: Observable<string>;
  public companyJobsWithNoTemplateError$: Observable<boolean>;
  public companyJobsWithNoTemplateErrorMessage$: Observable<string>;
  public companyJobsWithTemplateError$: Observable<boolean>;
  public companyJobsWithTemplateErrorMessage$: Observable<string>;
  private template$: Observable<Template>;
  private templateAssignmentSummary$: Observable<any>;
  private companyJobsWithNoTemplate$: Observable<CompanyJob[]>;
  private companyJobsWithTemplate$: Observable<CompanyJob[]>;
  private saveSuccess$: Observable<boolean>;

  private templateSubscription: Subscription;
  private templateAssignmentSummarySubscription: Subscription;
  private companyJobsWithNoTemplateSubscription: Subscription;
  private companyJobsWithTemplateSubscription: Subscription;
  private saveSuccessSubscription: Subscription;

  public selectedFamily: string;
  public assignTabSelectAllStatus = false;
  public unassignTabSelectAllStatus = false;
  public templateAssignmentSummary: any;
  private templateId: number;
  private assignTabSelectedCompanyJobIds: number[];
  private assignTabVisibleCompanyJobIds: number[];
  private unassignTabSelectedCompanyJobIds: number[];
  private unassignTabVisibleCompanyJobIds: number[];
  private activeTab = 'Assign';
  private searchTerm = '';
  private modalRef: NgbModalRef;
  private searchPipe: CompanyJobSearchPipe;

  constructor(
    private store: Store<fromTemplateReducers.State>,
    private sharedStore: Store<fromSharedJdmState.JobDescriptionManagementSharedState>,
      private modalService: NgbModal
  ) {
      this.template$ = this.store.select(fromTemplateReducers.getTemplate);
      this.templateAssignmentSummary$ = this.store.select(fromTemplateReducers.getTemplateAssignmentSummary);

      this.companyJobsWithNoTemplate$ = this.store.select(fromTemplateReducers.getCompanyJobsWithNoTemplate);
      this.companyJobsWithNoTemplateLoading$ = this.store.select(fromTemplateReducers.getCompanyJobsWithNoTemplateLoading);
      this.companyJobsWithNoTemplateError$ = this.store.select(fromTemplateReducers.getCompanyJobsWithNoTemplateError);
      this.companyJobsWithNoTemplateErrorMessage$ = this.store.select(fromTemplateReducers.getCompanyJobsWithNoTemplateErrorMessage);
      this.selectedCompanyJobIdsWithNoTemplate$ = this.store.select(fromTemplateReducers.getSelectedCompanyJobsWithNoTemplate);

      this.companyJobsWithTemplate$ = this.store.select(fromTemplateReducers.getCompanyJobsWithTemplate);
      this.companyJobsWithTemplateLoading$ = this.store.select(fromTemplateReducers.getCompanyJobsWithTemplateLoading);
      this.companyJobsWithTemplateError$ = this.store.select(fromTemplateReducers.getCompanyJobsWithTemplateError);
      this.companyJobsWithTemplateErrorMessage$ = this.store.select(fromTemplateReducers.getCompanyJobsWithTemplateErrorMessage);
      this.selectedCompanyJobIdsWithTemplate$ = this.store.select(fromTemplateReducers.getSelectedCompanyJobsWithTemplate);

      this.jobFamilies$ = this.sharedStore.select(fromSharedJdmState.getJobFamilies);
      this.jobFamiliesLoadingError$ = this.sharedStore.select(fromSharedJdmState.getJobFamiliesLoadingError);
      this.jobFamiliesLoadingErrorMessage$ = this.sharedStore.select(fromSharedJdmState.getJobFamiliesLoadingErrorMessage);

      this.saving$ = this.store.select(fromTemplateReducers.getJobAssignmentSaving);
      this.saveSuccess$ = this.store.select(fromTemplateReducers.getJobAssignmentSavingSuccess);
      this.saveError$ = this.store.select(fromTemplateReducers.getJobAssignmentSavingError);
      this.saveErrorMessage$ = this.store.select(fromTemplateReducers.getJobAssignmentSavingErrorMessage);

      this.searchPipe = new CompanyJobSearchPipe();
  }

  ngOnInit() {
    this.store.dispatch(new fromJobFamilyActions.LoadJobFamilies());
    this.initializeSubscriptions();
  }

  ngOnDestroy() {
      this.templateSubscription.unsubscribe();
      this.companyJobsWithNoTemplateSubscription.unsubscribe();
      this.companyJobsWithTemplateSubscription.unsubscribe();
      this.templateAssignmentSummarySubscription.unsubscribe();
      this.saveSuccessSubscription.unsubscribe();
  }

  open() {
    this.getCollectionOfJobsWithFamily('');
    this.setActiveTab('Assign');
    this.modalRef = this.modalService.open(this.assignModal, { backdrop: 'static', size: 'lg' });
  }

  close() {
    this.searchTerm = '';
    this.store.dispatch(new fromTemplateActions.ClearCompanyJobTemplateAssignmentModal());
    this.modalRef.close();
  }

  getCollectionOfJobsWithFamily(jobFamily: string) {
    this.store.dispatch(new fromTemplateActions.LoadJobsByFamilyWithNoTemplate({jobFamily: jobFamily, templateId: this.templateId}));
    this.store.dispatch(new fromTemplateActions.LoadJobsByFamilyWithTemplate({jobFamily: jobFamily, templateId: this.templateId}));
    this.selectedFamily = jobFamily;
  }

  saveTemplateJobAssignments() {
    this.store.dispatch(new fromTemplateActions.SaveCompanyJobTemplateAssignment({
        templateId: this.templateId,
        companyJobIdsToAssign: this.assignTabSelectedCompanyJobIds,
        companyJobIdsToUnassign: this.unassignTabSelectedCompanyJobIds
    }));
  }

  selectCompanyJob(companyJobId: number) {
    if (this.activeTab === 'Assign') {
        this.store.dispatch(new fromTemplateActions.SelectCompanyJobAssignTab({companyJobId}));
        this.assignTabSelectAllStatus = this.selectAllCheckboxStatusCheck(this.assignTabVisibleCompanyJobIds, this.assignTabSelectedCompanyJobIds);
    } else {
        this.store.dispatch(new fromTemplateActions.SelectCompanyJobUnassignTab({companyJobId}));
        this.unassignTabSelectAllStatus = this.selectAllCheckboxStatusCheck(this.unassignTabVisibleCompanyJobIds, this.unassignTabSelectedCompanyJobIds);
    }
  }

  selectAll(checked: boolean) {
    if (this.activeTab === 'Assign') {
        checked ? this.store.dispatch(new fromTemplateActions.SelectAllAssignTab({companyJobIds: this.assignTabVisibleCompanyJobIds}))
                : this.store.dispatch(new fromTemplateActions.ClearVisibleSelectionsAssignTab({companyJobIds: this.assignTabVisibleCompanyJobIds}));
        this.assignTabSelectAllStatus = this.selectAllCheckboxStatusCheck(this.assignTabVisibleCompanyJobIds, this.assignTabSelectedCompanyJobIds);
    } else {
        checked ? this.store.dispatch(new fromTemplateActions.SelectAllUnassignTab({companyJobIds: this.unassignTabVisibleCompanyJobIds}))
                : this.store.dispatch(new fromTemplateActions.ClearVisibleSelectionsUnassignTab({companyJobIds: this.unassignTabVisibleCompanyJobIds}));
        this.unassignTabSelectAllStatus = this.selectAllCheckboxStatusCheck(this.unassignTabVisibleCompanyJobIds, this.unassignTabSelectedCompanyJobIds);
    }
  }

  selectAllCheckboxStatusCheck(visibleCompanyJobIdCollection: number[], selectedCompanyJobIdCollection: number[]) {
    if (!visibleCompanyJobIdCollection.length) {
        return false;
    }

    for (const id of visibleCompanyJobIdCollection) {
        if (selectedCompanyJobIdCollection.indexOf(id) === -1) {
            return false;
        }
    }
    return true;
  }

  filterJobList(searchBoxInput: string) {
    this.companyJobsWithNoTemplateSubscription.unsubscribe();
    this.companyJobsWithTemplateSubscription.unsubscribe();
    this.searchTerm = searchBoxInput;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  initializeSubscriptions() {
    this.companyJobsWithNoTemplateSubscription = this.companyJobsWithNoTemplate$.subscribe(companyJobs => {
        companyJobs = this.searchPipe.transform(companyJobs, this.searchTerm);
        this.assignTabVisibleCompanyJobIds = companyJobs.filter(cj => !cj.CompanyJobDescriptionTemplateId).map(cj => cj.CompanyJobId);
        this.selectedCompanyJobIdsWithNoTemplate$.subscribe(scj => this.assignTabSelectedCompanyJobIds = scj);

        this.assignTabSelectAllStatus = this.selectAllCheckboxStatusCheck(this.assignTabVisibleCompanyJobIds, this.assignTabSelectedCompanyJobIds);
    });

    this.companyJobsWithTemplateSubscription = this.companyJobsWithTemplate$.subscribe(companyJobs => {
        companyJobs = this.searchPipe.transform(companyJobs, this.searchTerm);
        this.unassignTabVisibleCompanyJobIds = companyJobs.map(cj => cj.CompanyJobId);
        this.selectedCompanyJobIdsWithTemplate$.subscribe(scj => this.unassignTabSelectedCompanyJobIds = scj);

        this.unassignTabSelectAllStatus = this.selectAllCheckboxStatusCheck(this.unassignTabVisibleCompanyJobIds, this.unassignTabSelectedCompanyJobIds);
    });

    this.templateSubscription = this.template$.subscribe(t => {
      if (t) {
      this.templateId = t.TemplateId;
    }});
    this.templateAssignmentSummarySubscription = this.templateAssignmentSummary$.subscribe(s => this.templateAssignmentSummary = s);
    this.saveSuccessSubscription = this.saveSuccess$.subscribe(success => {
        if (success) {
            this.close();
        }
    });
  }

}
