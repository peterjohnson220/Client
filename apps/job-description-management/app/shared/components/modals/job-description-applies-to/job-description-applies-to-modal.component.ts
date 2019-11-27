import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { TemplateListItem } from 'libs/models/jdm';

import { CompanyJobViewListItem } from '../../../../_job-description/models';
import { JobDescriptionAppliesTo } from '../../../models/job-description-applies-to.model';
import * as fromTemplateListActions from '../../../actions/template-list.actions';
import * as fromJobDescriptionAppliesToActions from '../../../actions/job-description-appliesto.actions';
import * as fromJobDescriptionAppliesToReducers from '../../../reducers';
import { JobDescriptionAppliesToItem } from '../../../models/job-description-appliesto-item.model';
import { AppliesToAttributesExist } from '../../../models/applies-to-attributes-exist.model';

@Component({
  selector: 'pf-job-description-applies-to-modal',
  templateUrl: './job-description-applies-to-modal.component.html'
})
export class JobDescriptionAppliesToModalComponent implements OnInit, OnDestroy {
  @ViewChild('jobDescriptionAppliesToModal', { static: true }) public jobDescriptionAppliesToModal: any;

  @Input() selectedCompanyJob: CompanyJobViewListItem;
  @Input() editing: boolean;

  @Output() appliesToUpdated = new EventEmitter();

  private appliesToform: FormGroup;

  private jobDescriptionAppliesToItems$: Observable<JobDescriptionAppliesToItem[]>;
  private templateListItems$: Observable<TemplateListItem[]>;
  private jobDescriptionAppliesToItemsLoading$: Observable<boolean>;
  private jobDescriptionAppliesToValues$: Observable<string[]>;
  private jobDescriptionAppliesToValuesLoading$: Observable<boolean>;
  private appliesToAttributesExist$: Observable<AppliesToAttributesExist>;

  private appliesToField: string;
  private appliesToValue: string;
  private jobDescriptionTitle: string;
  private appliesTo: JobDescriptionAppliesTo;
  private jobDescriptionTitleExists: boolean;
  private appliesToValueInvalid: boolean;
  private requiredFieldsFilledIn = true;
  private canRemoveValues: boolean;
  private appliesToExists: boolean;
  private jobDescriptionId: number;
  private companyJobId: number;
  private loading = false;
  private loadingFailed = false;
  private searchColumnName: string;
  private templateId = -1;

  private appliesToAttributesExistSubscription: Subscription;

  public source: string[];
  public data: string[];

  constructor(
    // private jobDescriptionService: JobDescriptionService,
    // private store: Store<JobDescriptionsState>,
    // private templateStore: Store<TemplatesState>,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store<fromJobDescriptionAppliesToReducers.State>
    // private jobDescriptionApiService: JobDescriptionApiService,
    // private templateService: TemplateService

  ) {
    this.templateListItems$ = this.store.select(fromJobDescriptionAppliesToReducers.getTemplateList);
    this.jobDescriptionAppliesToItems$ = this.store.select(
      fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToItems);
    this.jobDescriptionAppliesToItemsLoading$ = this.store.select(
      fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToLoading);
    this.jobDescriptionAppliesToValues$ = this.store.select(
      fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToValues);
    this.jobDescriptionAppliesToValuesLoading$ = this.store.select(
      fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToValuesLoading);
    this.appliesToAttributesExist$ = this.store.select(
      fromJobDescriptionAppliesToReducers.getAppliesToAttributesExist);
  }

  ngOnDestroy(): void {
    this.appliesToAttributesExistSubscription.unsubscribe();
  }

  open(jobDescriptionId: number, companyJobId: number, appliesTo?: JobDescriptionAppliesTo) {
    this.jobDescriptionId = jobDescriptionId;
    this.companyJobId = companyJobId;

    this.appliesToform.reset();
    this.resetFlags('All');

    this.initializeFormValues(appliesTo);

    this.store.dispatch(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesTo());
    this.store.dispatch(new fromTemplateListActions.LoadTemplateList({ publishedOnly: true }));

    this.templateId = -1;
    this.modalService.open(this.jobDescriptionAppliesToModal, { backdrop: 'static' });
  }


  initializeFormValues(appliesTo?: JobDescriptionAppliesTo) {
    if (appliesTo) {
      if (appliesTo.AppliesToField) {
        this.store.dispatch(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToValues(
          {SearchTerm: appliesTo.AppliesToField}));
      }
      this.appliesToform.setValue({
        appliesToField: appliesTo.AppliesToField ? appliesTo.AppliesToField : '',
        appliesToValue: appliesTo.AppliesToValue ? appliesTo.AppliesToValue : '',
        jobDescriptionTitle: appliesTo.JobDescriptionTitle ? appliesTo.JobDescriptionTitle : ''
      });
    } else {
      this.appliesToform.setValue({
        appliesToField: '',
        appliesToValue: '',
        jobDescriptionTitle: ''
      });
    }
  }

  submit() {
    if (this.appliesToform.valid) {
      const appliesTo = new JobDescriptionAppliesTo();
      appliesTo.AppliesToField = this.appliesToform.controls['appliesToField'].value
        ? this.appliesToform.controls['appliesToField'].value
        : '' ;
      appliesTo.AppliesToValue = this.appliesToform.controls['appliesToValue'].value
        ? this.appliesToform.controls['appliesToValue'].value
        : '';
      appliesTo.JobDescriptionTitle = this.appliesToform.controls['jobDescriptionTitle'].value
        ? this.appliesToform.controls['jobDescriptionTitle'].value
        : '';

      const request = {
        JobDescriptionId: this.jobDescriptionId,
        Request: {
          JobDescriptionAppliesTo: {
            JobDescriptionTitle: appliesTo.JobDescriptionTitle,
            AppliesToField: appliesTo.AppliesToField,
            AppliesToValue: appliesTo.AppliesToValue
          },
          Editing: this.editing
        }
      };

      this.store.dispatch(new fromJobDescriptionAppliesToActions.GetAppliesToAttributesExist(request));
    }

  }

  buildForm() {
    this.appliesToform = this.formBuilder.group({
      jobDescriptionTitle: ['', Validators.maxLength(255)],
      appliesToField: ['', Validators.maxLength(50)],
      appliesToValue: ['', Validators.maxLength(255)]

    });
  }

  ngOnInit() {
    this.buildForm();
    this.jobDescriptionAppliesToValues$.subscribe(values => {
      if (values) {
        this.source = values;
        this.data = this.source.slice();
      }
    });
    this.store.dispatch(new fromJobDescriptionAppliesToActions.ResetAppliesToAttributeExist());
    this.initializeSubscriptions();
  }

  handleAppliesToFieldChanged(selectedJobDescriptionAppliesToItem: string) {
    this.appliesToform.controls['appliesToValue'].setValue('');
    this.resetFlags('AppliesTo');

    if (selectedJobDescriptionAppliesToItem.length) {
      this.searchColumnName = selectedJobDescriptionAppliesToItem;
      this.store.dispatch(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesToValues(
        {SearchTerm: this.searchColumnName}));
    } else {
      this.searchColumnName = '';
    }
  }

  handleJobDescriptionChanged() {
    this.resetFlags('JobDescriptionTitle');
  }

  handleAppliesToValueChanged() {
    this.resetFlags('AppliesTo');
  }

  handleFilter(value) {
    this.data = this.source.filter((s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  resetFlags(reset: string) {
    this.requiredFieldsFilledIn = true;

    if (reset === 'All' || reset === 'AppliesTo') {
      this.appliesToExists = false;
      this.appliesToValueInvalid = false;
    }

    if (reset === 'All' || reset === 'JobDescriptionTitle') {
      this.jobDescriptionTitleExists = false;
    }
  }

  initializeSubscriptions() {
    this.appliesToAttributesExistSubscription = this.appliesToAttributesExist$.subscribe((result: AppliesToAttributesExist) => {
      if (result) {
        this.canRemoveValues = result.CanRemoveValues;

        if ((!this.editing &&
          (result.JobDescriptionAppliesTo.JobDescriptionTitle || result.JobDescriptionAppliesTo.AppliesToValue)) ||
          (this.editing &&
            (this.canRemoveValues ||
              (result.JobDescriptionAppliesTo.JobDescriptionTitle ||
                result.JobDescriptionAppliesTo.AppliesToValue)))) {
          this.jobDescriptionTitleExists = result.JobDescriptionTitleExists;
          this.appliesToExists = result.AppliesToExists;
          this.appliesToValueInvalid = result.AppliesToValueInvalid;

          if (!this.jobDescriptionTitleExists && !this.appliesToExists && !this.appliesToValueInvalid) {
            this.appliesToUpdated.emit(
              {
                jobDescriptionId: this.jobDescriptionId,
                jobDescriptionAppliesTo: result.JobDescriptionAppliesTo,
                companyJobId: this.companyJobId,
                templateId: this.templateId
              });

            this.modalService.dismissAll();
          }
        } else {
          this.requiredFieldsFilledIn = false;
        }
      }
    });
  }

}
