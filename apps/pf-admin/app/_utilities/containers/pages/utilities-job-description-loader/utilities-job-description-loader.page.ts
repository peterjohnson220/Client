import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ValidationResultItem } from 'libs/models/common';
import { Company } from 'libs/models/company/company.model';
import { TemplateListItem } from 'libs/models/jdm/template-list-item.model';
import { ValidateStepResultItem } from 'libs/models/jdm/validation-step-result-item.model';

import * as fromUtilitiesReducer from '../../../reducers';
import * as fromTemplateListReducer from '../../../../../../job-description-management/app/shared/reducers';
import * as fromJobDescriptionLoaderActions from '../../../actions/job-description-loader.actions.js';
import { ConfirmDeleteJobDescriptionsModalComponent } from '../../../components/confirm-delete-job-descriptions-modal';

@Component({
  selector: 'pf-site-admin-job-description-loader-page',
  templateUrl: './utilities-job-description-loader.page.html',
  styleUrls: ['./utilities-job-description-loader.page.scss']

})
export class JobDescriptionLoaderPageComponent implements OnInit {
  @ViewChild(ConfirmDeleteJobDescriptionsModalComponent, { static: false })
  public confirmDeleteJobDescriptionsModalComponent: ConfirmDeleteJobDescriptionsModalComponent;

  public isMappingCollapsed = false;
  public isFileUploadCollapsed = false;
  public isCollapsed = false;

  templateListItems$: Observable<TemplateListItem[]>;
  templateListLoading$: Observable<boolean>;

  jobDescriptionLoaderValidationResults$: Observable<ValidateStepResultItem>;
  jobDescriptionLoaderImportResults$: Observable<ValidationResultItem[]>;
  jobDescriptionLoaderValidating$: Observable<boolean>;
  jobDescriptionLoaderValidated$: Observable<boolean>;
  jobDescriptionLoaderImporting$: Observable<boolean>;
  jobDescriptionLoaderImported$: Observable<boolean>;
  deletingJobDescriptions$: Observable<boolean>;
  deletingJobDescriptionsError$: Observable<boolean>;
  company$: Observable<Company>;

  companyId: number;
  importMode: string;
  mappingFile: File;
  dataFile: File;
  storedMappingFile: string;
  storedDataFile: string;

  constructor(
    private store: Store<fromTemplateListReducer.State>,
    private sharedStore: Store<fromUtilitiesReducer.State>,
    private route: ActivatedRoute
  ) {
    this.templateListItems$ = this.store.pipe(select(fromTemplateListReducer.getTemplateList));
    this.templateListLoading$ = this.store.pipe(select(fromTemplateListReducer.getTemplateListLoading));
    this.jobDescriptionLoaderValidationResults$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getValidationResults));
    this.jobDescriptionLoaderImportResults$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getImportingResults));
    this.jobDescriptionLoaderValidating$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getValidating));
    this.jobDescriptionLoaderValidated$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getValidated));
    this.jobDescriptionLoaderImporting$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getImporting));
    this.jobDescriptionLoaderImported$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getImported));
    this.deletingJobDescriptions$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getDeletingJobDescriptions));
    this.deletingJobDescriptionsError$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getDeletingJobDescriptionsError));
    this.company$ = this.sharedStore.pipe(select(fromUtilitiesReducer.getJobDescriptionLoaderCompany));
  }

  ngOnInit() {
    this.companyId = parseInt(this.route.snapshot.params['id'], 10);
    this.importMode = 'INSERT';

    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.Reset());
    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.LoadCompany(this.companyId));
  }

  mappingFileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.mappingFile = fileList[0];
      this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.Reset());
    }
  }

  dataFileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.dataFile = fileList[0];
      this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.Reset());
    }
  }

  remove(type: string, inputElement: HTMLInputElement) {
    inputElement.value = null;
    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.Reset());

    if (type === 'mappingFile') {
      this.mappingFile = null;
    }
    if (type === 'dataFile') {
      this.dataFile = null;
    }
  }

  validate() {
    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.ValidateJobDescriptionImport(
      {companyId: this.companyId, mappingFile: this.mappingFile, dataFile: this.dataFile, importMode: this.importMode}
      ));

    this.jobDescriptionLoaderValidated$.subscribe(jobDescriptionLoadValidated => {
      if (jobDescriptionLoadValidated) {
        this.isMappingCollapsed = true;
        this.isFileUploadCollapsed = true;
      }
    });
  }

  upload() {
    this.jobDescriptionLoaderValidationResults$.subscribe(validationResultItem => {
      if (validationResultItem != null) {
        this.storedMappingFile = validationResultItem.StoredMappingFile;
        this.storedDataFile = validationResultItem.StoredDataFile;
      }
    });

    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.LoadJobDescriptions(
      { CompanyId: this.companyId, StoredMappingFile: this.storedMappingFile, StoredDataFile: this.storedDataFile }
    ));
  }

  confirmDeleteJobDescriptions(templateListItem: TemplateListItem) {
    this.confirmDeleteJobDescriptionsModalComponent.open(templateListItem);
  }

  clearDeleteJobDescriptionsError() {
    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.ClearDeleteJobDescriptionsError());
  }

  deleteJobDescriptionsForTemplate(templateId: number) {
    this.sharedStore.dispatch(new fromJobDescriptionLoaderActions.DeleteJobDescriptions(
      {
        request: {companyId: this.companyId, templateId: templateId},
        successFn: () => this.confirmDeleteJobDescriptionsModalComponent.close()
      }
    ));
  }
}
