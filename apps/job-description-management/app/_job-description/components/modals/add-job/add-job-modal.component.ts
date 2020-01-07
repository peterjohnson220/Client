import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CompanyJobUdfColumn } from 'libs/models/jdm/company-job-udf-column';
import { CompanyJob } from 'libs/models/company';
import { UserContext } from 'libs/models/security';
import { TemplateListItem } from 'libs/models/jdm';

import * as fromAddJobModalActions from '../../../actions/add-job-modal.actions';
import * as fromCompanyFlsaStatusActions from '../../../../shared/actions/company-flsa-status.actions';
import * as fromJobFamilyActions from '../../../../shared/actions/job-family.actions';
import * as fromTemplateListActions from '../../../../shared/actions/template-list.actions';
import * as fromAddJobModalReducers from '../../../reducers';
import * as fromSharedReducers from '../../../../shared/reducers';

@Component({
  selector: 'pf-add-job-modal',
  templateUrl: './add-job-modal.component.html',
  styleUrls: ['./add-job-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddJobModalComponent implements OnInit, OnDestroy {
  @Input() canRestrictJobDescriptionFromPublicView: boolean;
  @Output() createCompanyJobComplete = new EventEmitter();
  @ViewChild('addJobModal', { static: true }) addJobModal: any;

  public activeTab = 'Standard Fields';
  public addAndAssign = false;
  public addJobForm: FormGroup;
  public companyId: number;
  public companyJobMessage: string;
  public companyJobSaveObj: CompanyJob;
  public jobFamilies$: Observable<string[]>;
  public jobFLSAStatus$: Observable<string[]>;
  public jobStatus = true;
  public jobUserDefinedFields$: Observable<CompanyJobUdfColumn[]>;
  public modalRef: NgbModalRef;
  public publicView: Array<any> = [{ text: 'Enabled', value: true }, { text: 'Disabled', value: false }];
  public publicViewSelectedValue = true;
  public templateListItems$: Observable<TemplateListItem[]>;
  public templateListLoading$: Observable<boolean>;

  private companyJob$: Observable<CompanyJob>;
  private companyJobMessage$: Observable<string>;
  private companyJobMessageSubscription: Subscription;
  private companyJobSaveSubscription: Subscription;
  private companyJobSaveSuccess$: Observable<boolean>;
  private companyJobSaveSuccessSubscription: Subscription;
  private identity$: Observable<UserContext>;

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromAddJobModalReducers.State>,
    private sharedStore: Store<fromSharedReducers.State>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.companyJob$ = this.store.select(fromAddJobModalReducers.getCompanyJob);
    this.companyJobMessage$ = this.store.select(fromAddJobModalReducers.getDuplicateCompanyJobMessage);
    this.companyJobSaveSuccess$ = this.store.select(fromAddJobModalReducers.getCompanyJobCreatingSuccess);
    this.identity$ = this.rootStore.select(fromRootState.getUserContext);
    this.jobFamilies$ = this.sharedStore.select(fromSharedReducers.getJobFamilies);
    this.jobFLSAStatus$ = this.sharedStore.select(fromSharedReducers.getCompanyFlsaStatuses);
    this.jobUserDefinedFields$ = this.store.select(fromAddJobModalReducers.getCompanyJobUdfColumns);
    this.templateListItems$ = this.sharedStore.select(fromSharedReducers.getTemplateList);
    this.templateListLoading$ = this.sharedStore.select(fromSharedReducers.getTemplateListLoading);
  }

  ngOnInit() {
    this.createSubscriptions();
    this.dispatch();
    this.subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  handleJobCodeChanged() {
    this.store.dispatch(new fromAddJobModalActions.SetDuplicateCompanyJobMessage(''));
  }

  handleTemplateChanged(value: any) {
    if (!value || value === -1) {
      this.addAndAssign = false;
    } else {
      this.addAndAssign = true;
    }
  }

  open() {
    this.addJobForm.reset();
    this.addAndAssign = false;
    this.addJobForm.patchValue({ CompanyId: this.companyId, JobStatus: true });
    this.sharedStore.dispatch(new fromTemplateListActions.LoadTemplateList({ publishedOnly: true }));
    this.store.dispatch(new fromAddJobModalActions.SetDuplicateCompanyJobMessage(''));
    this.modalRef = this.modalService.open(this.addJobModal, { backdrop: 'static', size: 'lg' });
  }

  submit() {
    if (this.addJobForm.valid) {
      this.store.dispatch(new fromAddJobModalActions.CreateCompanyJob(this.companyJobSaveObj));
    }
  }

  private createSubscriptions() {
    this.companyJobSaveSubscription = this.companyJob$.subscribe(companyJob => this.companyJobSaveObj = companyJob);
    this.companyJobMessageSubscription = this.companyJobMessage$.subscribe(errMessage => this.companyJobMessage = errMessage);
    this.companyJobSaveSuccessSubscription = this.companyJobSaveSuccess$.subscribe(response => {
      if (response) {
        this.createCompanyJobComplete.emit({
          addAndAssign: this.addAndAssign,
          companyJobId: response ? this.companyJobSaveObj.CompanyJobId : null,
          publicView: this.publicViewSelectedValue
        });

        this.modalRef.close();
        }
    });
  }

  private dispatch() {
    this.sharedStore.dispatch(new fromJobFamilyActions.LoadJobFamilies());
    this.sharedStore.dispatch(new fromCompanyFlsaStatusActions.LoadCompanyFlsaStatuses());
    this.store.dispatch(new fromAddJobModalActions.LoadCompanyJobUdfColumns());
  }

  private subscribe() {
    this.identity$.subscribe(i => {
      this.companyId = i.CompanyId;
    });

    this.jobUserDefinedFields$.subscribe(userDefinedFields => {
      const group = this.formBuilder.group({});

      group.addControl('JobCode', new FormControl('', [Validators.required, Validators.maxLength(50)]));
      group.addControl('JobFamily', new FormControl(''));
      group.addControl('JobTitle', new FormControl('', [Validators.required, Validators.maxLength(255)]));
      group.addControl('JobLevel', new FormControl('', Validators.maxLength(255)));
      group.addControl('FLSAStatus', new FormControl(''));
      group.addControl('JobStatus', new FormControl(''));
      group.addControl('CompanyId', new FormControl(''));
      group.addControl('CompanyJobDescriptionTemplateId', new FormControl(''));

      for (const userDefinedField of userDefinedFields) {
        group.addControl(userDefinedField.ColumnName, new FormControl(''));
      }

      this.addJobForm = group;

      this.addJobForm.valueChanges.subscribe(value => {
        this.store.dispatch(new fromAddJobModalActions.UpdateCompanyJob(value));
      });
    });
  }

  private unsubscribe() {
    this.companyJobSaveSubscription.unsubscribe();
    this.companyJobMessageSubscription.unsubscribe();
    this.companyJobSaveSuccessSubscription.unsubscribe();
  }
}
