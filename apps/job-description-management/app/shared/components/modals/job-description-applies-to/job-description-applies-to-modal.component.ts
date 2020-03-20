import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { TemplateListItem } from 'libs/models/jdm';

import { CompanyJobViewListItem } from '../../../../_job-description/models';
import { JobDescriptionAppliesTo } from '../../../models/job-description-applies-to.model';
import * as fromTemplateListActions from '../../../actions/template-list.actions';
import * as fromJobDescriptionAppliesToActions from '../../../actions/job-description-appliesto.actions';
import * as fromJobDescriptionAppliesToReducers from '../../../reducers';
import { JobDescriptionAppliesToItem } from '../../../models/job-description-appliesto-item.model';
import { AppliesToAttributesExist } from '../../../models/applies-to-attributes-exist.model';
import { Permissions } from 'libs/constants';
import { JobDescriptionViewConstants } from '../../../constants';

@Component({
  selector: 'pf-job-description-applies-to-modal',
  templateUrl: './job-description-applies-to-modal.component.html'
})
export class JobDescriptionAppliesToModalComponent implements OnInit, OnDestroy {
  @Input() editing: boolean;
  @Input() selectedCompanyJob: CompanyJobViewListItem;
  @Output() appliesToUpdated = new EventEmitter();
  @ViewChild('jobDescriptionAppliesToModal', { static: true }) public jobDescriptionAppliesToModal: any;

  public appliesTo: JobDescriptionAppliesTo;
  public appliesToExists: boolean;
  public appliesToField: string;
  public appliesToform: FormGroup;
  public appliesToValue: string;
  public appliesToValueInvalid: boolean;
  public data: string[];
  public jobDescriptionAppliesToItems$: Observable<JobDescriptionAppliesToItem[]>;
  public jobDescriptionAppliesToItemsLoading$: Observable<boolean>;
  public jobDescriptionAppliesToValuesLoading$: Observable<boolean>;
  public jobDescriptionTitle: string;
  public jobDescriptionTitleExists: boolean;
  public loading = false;
  public loadingFailed = false;
  public permissions = Permissions;
  public publicViewSelectedComboValue = true;
  public requiredFieldsFilledIn = true;
  public source: string[];
  public templateId = -1;
  public templateListItems$: Observable<TemplateListItem[]>;

  private appliesToAttributesExist$: Observable<AppliesToAttributesExist>;
  private appliesToAttributesExistSubscription: Subscription;
  private canRemoveValues: boolean;
  private companyJobId: number;
  private jobDescriptionAppliesToValues$: Observable<string[]>;
  private jobDescriptionId: number;
  private modalRef: NgbModalRef;
  private requiredAppliesToFieldFilledIn: boolean;
  private requiredAppliesToValueFilledIn: boolean;
  private searchColumnName: string;
  private publicViewOptions = JobDescriptionViewConstants.PUBLIC_VIEW_OPTIONS;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store<fromJobDescriptionAppliesToReducers.State>
  ) {
    this.templateListItems$ = this.store.select(fromJobDescriptionAppliesToReducers.getTemplateList);
    this.jobDescriptionAppliesToItems$ = this.store.select(fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToItems);
    this.jobDescriptionAppliesToItemsLoading$ = this.store.select(fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToLoading);
    this.jobDescriptionAppliesToValues$ = this.store.select(fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToValues);
    this.jobDescriptionAppliesToValuesLoading$ = this.store.select(fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToValuesLoading);
    this.appliesToAttributesExist$ = this.store.select(fromJobDescriptionAppliesToReducers.getAppliesToAttributesExist);
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
    this.modalRef = this.modalService.open(this.jobDescriptionAppliesToModal, { backdrop: 'static', size: 'lg' });
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
        jobDescriptionTitle: appliesTo.JobDescriptionTitle ? appliesTo.JobDescriptionTitle : '',
        publicView: appliesTo.PublicView == null ? true : appliesTo.PublicView
      });
    } else {
      this.appliesToform.setValue({
        appliesToField: '',
        appliesToValue: '',
        jobDescriptionTitle: '',
        publicView: this.publicViewSelectedComboValue
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
      appliesTo.PublicView = this.appliesToform.controls['publicView'].value;

      const request = {
        JobDescriptionId: this.jobDescriptionId,
        Request: {
          JobDescriptionAppliesTo: {
            JobDescriptionTitle: appliesTo.JobDescriptionTitle,
            AppliesToField: appliesTo.AppliesToField,
            AppliesToValue: appliesTo.AppliesToValue,
            PublicView: appliesTo.PublicView
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
      appliesToValue: ['', Validators.maxLength(255)],
      publicView: true
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

    if (selectedJobDescriptionAppliesToItem) {
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
    this.requiredAppliesToValueFilledIn = true;
    this.requiredAppliesToFieldFilledIn = true;

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
        const jobDescriptionTitle = result.JobDescriptionAppliesTo.JobDescriptionTitle;
        const appliesToField = result.JobDescriptionAppliesTo.AppliesToField;
        const appliesToValue = result.JobDescriptionAppliesTo.AppliesToValue;

        if ((jobDescriptionTitle && appliesToField && appliesToValue) || (jobDescriptionTitle && !appliesToField) || (appliesToField && appliesToValue)) {
            this.requiredAppliesToValueFilledIn = true;
            this.requiredFieldsFilledIn = true;
            this.requiredAppliesToFieldFilledIn = true;
            this.appliesToform.setErrors({'invalid': false});
        } else if (appliesToField && !appliesToValue) {
            this.requiredAppliesToValueFilledIn = false;
            this.appliesToform.setErrors({'invalid': true});
        } else if (!appliesToField && appliesToValue) {
            this.requiredAppliesToFieldFilledIn = false;
            this.appliesToform.setErrors({'invalid': true});
        } else {
            this.requiredFieldsFilledIn = false;
            this.appliesToform.setErrors({'invalid': true});
        }

        if ((!this.editing &&
          (this.requiredFieldsFilledIn && this.requiredAppliesToValueFilledIn)) ||
          (this.editing &&
            (this.canRemoveValues ||
              (this.requiredFieldsFilledIn &&
                this.requiredAppliesToValueFilledIn)))) {
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
        }
      }
    });
  }

}
