import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CompanyJobUdfColumn } from 'libs/models/jdm/company-job-udf-column';
import { CompanyJob } from 'libs/models/company';
import { UserContext } from 'libs/models/security';
import { TemplateListItem } from 'libs/models/jdm';
import { JobDescriptionViewConstants } from '../../../../shared/constants';

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
  public duplicateJobCodeErrorMessage: string;
  public companyJobErrorMessage: string;
  public companyJobSaveObj: CompanyJob;
  public jobFamilies$: Observable<string[]>;
  public jobFLSAStatus$: Observable<string[]>;
  public jobStatus = true;
  public jobUserDefinedFields$: Observable<CompanyJobUdfColumn[]>;
  public modalRef: NgbModalRef;
  public publicViewSelectedValue = true;
  public templateListItems$: Observable<TemplateListItem[]>;
  public templateListLoading$: Observable<boolean>;
  public publicViewOptions = JobDescriptionViewConstants.PUBLIC_VIEW_OPTIONS;
  public invalidCharactersMsg = JobDescriptionViewConstants.INVALID_CHARACTERS;

  private companyJob$: Observable<CompanyJob>;
  private duplicateJobCodeErrorMessage$: Observable<string>;
  private companyJobMessageSubscription: Subscription;
  private companyJobSaveSubscription: Subscription;
  private companyJobSaveSuccess$: Observable<boolean>;
  private companyJobSaveSuccessSubscription: Subscription;
  private identity$: Observable<UserContext>;
  private companyJobCreating$: Observable<boolean>;
  private companyJobSaveError$: Observable<boolean>;
  private companyJobSaveErrorMessage$: Observable<string>;
  private companyJobSaveErrorSubscription: Subscription;
  private companyJobSaveErrorMessageSubscription: Subscription;
  private duplicateJobCodeErrorMessageSubscription: Subscription;

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromAddJobModalReducers.State>,
    private sharedStore: Store<fromSharedReducers.State>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.companyJob$ = this.store.select(fromAddJobModalReducers.getCompanyJob);
    this.duplicateJobCodeErrorMessage$ = this.store.select(fromAddJobModalReducers.getDuplicateCompanyJobMessage);
    this.companyJobSaveSuccess$ = this.store.select(fromAddJobModalReducers.getCompanyJobCreatingSuccess);
    this.identity$ = this.rootStore.select(fromRootState.getUserContext);
    this.jobFamilies$ = this.sharedStore.select(fromSharedReducers.getJobFamilies);
    this.jobFLSAStatus$ = this.sharedStore.select(fromSharedReducers.getCompanyFlsaStatuses);
    this.jobUserDefinedFields$ = this.store.select(fromAddJobModalReducers.getCompanyJobUdfColumns);
    this.templateListItems$ = this.sharedStore.select(fromSharedReducers.getTemplateList);
    this.templateListLoading$ = this.sharedStore.select(fromSharedReducers.getTemplateListLoading);
    this.companyJobCreating$ = this.store.select(fromAddJobModalReducers.getCompanyJobCreating);
    this.companyJobSaveError$ = this.store.select(fromAddJobModalReducers.getCompanyJobCreatingError);
    this.companyJobSaveErrorMessage$ = this.store.select(fromAddJobModalReducers.getCompanyJobCreatingErrorMessage);
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
    this.duplicateJobCodeErrorMessage = '';
  }

  handleTemplateChanged(value: any) {
    if (!value || value === -1) {
      this.addAndAssign = false;
    } else {
      this.addAndAssign = true;
    }
  }

  valueChange(selection) {
    this.publicViewSelectedValue = selection;
  }

  open() {
    this.addJobForm.reset();
    this.addAndAssign = false;
    this.addJobForm.patchValue({ CompanyId: this.companyId, JobStatus: true });
    this.sharedStore.dispatch(new fromTemplateListActions.LoadTemplateList({ publishedOnly: true }));
    this.modalRef = this.modalService.open(this.addJobModal, { backdrop: 'static', size: 'lg' });
  }

  submit() {
    if (this.addJobForm.valid) {
      this.store.dispatch(new fromAddJobModalActions.CreateCompanyJob(this.companyJobSaveObj));
    }
  }

  private createSubscriptions() {
    this.companyJobSaveSubscription = this.companyJob$.subscribe(companyJob => this.companyJobSaveObj = companyJob);
    this.duplicateJobCodeErrorMessageSubscription = this.duplicateJobCodeErrorMessage$.subscribe(errMessage => this.duplicateJobCodeErrorMessage = errMessage);
    this.companyJobSaveSuccessSubscription = this.companyJobSaveSuccess$.subscribe(response => {
      if (response) {
        this.createCompanyJobComplete.emit({
          addAndAssign: this.addAndAssign,
          companyJobId: response ? this.companyJobSaveObj.CompanyJobId : null,
          publicView: this.publicViewSelectedValue
        });

        if  (this.modalRef) {
          this.modalRef.close();
        }
      }
    });
    this.companyJobSaveErrorMessageSubscription = this.companyJobSaveErrorMessage$.subscribe(em => this.companyJobErrorMessage = em);
    this.companyJobSaveErrorSubscription = this.companyJobSaveError$.subscribe(e => {
      if (e) {
        this.addJobForm.setErrors({'error': this.companyJobErrorMessage});
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

      group.addControl('JobCode', new FormControl('', [Validators.required, Validators.maxLength(50), this.validateCharacters]));
      group.addControl('JobFamily', new FormControl('', [this.validateCharacters]));
      group.addControl('JobTitle', new FormControl('', [Validators.required, Validators.maxLength(255), this.validateCharacters]));
      group.addControl('JobLevel', new FormControl('', [Validators.maxLength(255), this.validateCharacters]));
      group.addControl('FLSAStatus', new FormControl('', [this.validateCharacters]));
      group.addControl('JobStatus', new FormControl('', [this.validateCharacters]));
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
    this.duplicateJobCodeErrorMessageSubscription.unsubscribe();
    this.companyJobSaveSuccessSubscription.unsubscribe();
    this.companyJobSaveErrorSubscription.unsubscribe();
    this.companyJobSaveErrorMessageSubscription.unsubscribe();
  }

  private validateCharacters(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && control.value.length > 0) {
      const forbiddenCharacters = ['\\\'', '\\\"', ';', '<', '>'];
      const userInput = control.value;

      if (forbiddenCharacters.some(char => userInput.includes(char))) {
        return { 'invalidCharacters': true };
      }
    }

    return null;
  }
}
