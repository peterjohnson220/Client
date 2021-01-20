import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import cloneDeep from 'lodash/cloneDeep';
import { FileRestrictions, UploadEvent, FileInfo, RemoveEvent, SuccessEvent, CancelEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MappingHelper } from 'libs/core/helpers';
import { KendoUpload, KendoUploadStatus } from 'libs/models/common/';
import { formatBytes } from 'libs/core/functions';

import * as fromCompanyResourcesReducer from '../../reducers';
import * as fromCompanyResourcesActions from '../../actions/company-resources.actions';
import * as fromCompanyResourcesAddResourceActions from '../../actions/company-resources-add-resource.actions';
import { CompanyResourceFolder } from '../../models';
import { CompanyResourceUploadState } from '../../models/company-resource-upload-state.model';

@Component({
  selector: 'pf-resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.scss']
})
export class ResourceModalComponent implements OnInit, OnDestroy {
  @ViewChild('uploadWidget', { static: true }) uploadWidget: any;

  validFileExtensions = ['.jpg', '.jpeg', '.png', '.doc', '.xls', '.xlsx', '.pdf', '.docx', '.txt', '.csv', '.zip', '.mp4', '.wmv', '.avi'];
  removeResourceUrl = '/odata/CloudFiles.DeleteCompanyResources';
  saveResourceUrl = '/odata/CloudFiles.UploadCompanyResource';

  addingCompanyResourceErrorMsg$: Observable<string>;
  addingCompanyResourceErrorMsg: string;
  addingCompanyResourceErrorMsgSubscription: Subscription;
  companyResourceAddResourceModalOpen$: Observable<boolean>;
  companyResourceAddResourceModalOpenSubscription: Subscription;
  companyResourceUploadState: CompanyResourceUploadState;
  companyResourceUploadState$: Observable<CompanyResourceUploadState>;
  companyResourceUploadStateSubscription: Subscription;
  fileToUpload: KendoUpload;
  folderResources: CompanyResourceFolder[];
  folderResources$: Observable<CompanyResourceFolder[]>;
  folderResourceSubscription: Subscription;
  isFileSelected: boolean;
  isFormSubmitted = false;
  isUploadSuccess = false;
  isUrlProvided = false;
  kendoUploadStatus = KendoUploadStatus;
  resourceForm: FormGroup;
  uploadedFiles: KendoUpload[] = [];
  uploadedFilesKendo: Array<FileInfo>;
  uploadRestrictions: FileRestrictions = {
    allowedExtensions: this.validFileExtensions,
    maxFileSize: 157286400 // 150 MB
  };
  unsafeUrlFound: boolean;

  get fileRestrictionsMessage() {
    const formattedSize = formatBytes(this.uploadRestrictions.maxFileSize);
    let message = `File size cannot exceed ${formattedSize}. Accepted file types: `;
    this.validFileExtensions.forEach(extension => {
      message = `${message} ${extension}`;
    });
    return message;
   }

   formattedBytes(bytes) {
    return formatBytes(bytes);
  }

  constructor(public store: Store<fromCompanyResourcesReducer.State>, private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.addingCompanyResourceErrorMsg$ = this.store.select(fromCompanyResourcesReducer.getAddingCompanyResourceErrorMsg);
    this.folderResources$ = this.store.select(fromCompanyResourcesReducer.getCompanyFolderResources);

    this.companyResourceUploadState$ = this.store.select(fromCompanyResourcesReducer.getCompanyResourcesUploadState);
    this.companyResourceAddResourceModalOpen$ = this.store.select(fromCompanyResourcesReducer.getCompanyResourceAddResourceModalOpen);

    this.createSubscriptions();
    this.createForm();
  }

  ngOnDestroy() {
    this.folderResourceSubscription.unsubscribe();
    this.companyResourceUploadStateSubscription.unsubscribe();
    this.companyResourceAddResourceModalOpenSubscription.unsubscribe();
    this.addingCompanyResourceErrorMsgSubscription.unsubscribe();
  }

  selectEventHandler(e: SelectEvent): void {
    e.files.forEach((file) => {
      if (file.validationErrors && file.validationErrors.includes('invalidFileExtension')) {
        const cloudFileName = `${file.uid}_${file.name}`;
        this.fileToUpload = this.mapFileInfoToKendoUpload(file, cloudFileName);
        this.fileToUpload.Status = KendoUploadStatus.InvalidExtension;

        if (this.uploadedFiles.length > 0) {
          // TODO: Clean up orphaned cloud resource
          // this.store.dispatch(new fromCompanyResourcesAddResourceActions.DiscardCompanyResource(this.uploadedFiles[0].CloudFileName));
          this.uploadedFiles.splice(0);
        }

        this.uploadedFiles.push(this.fileToUpload);
      }

      this.isFileSelected = true;
    });
  }

  uploadEventHandler(e: UploadEvent) {
    const file = e.files[ 0 ];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = { CloudFileName: cloudFileName, Id: file.uid };

    this.fileToUpload = this.mapFileInfoToKendoUpload(file, cloudFileName);
    this.fileToUpload.Status = KendoUploadStatus.UploadInProgress;

    if (this.uploadedFiles.length > 0) {
      // TODO: Clean up orphaned cloud resource
      // this.store.dispatch(new fromCompanyResourcesAddResourceActions.DiscardCompanyResource(this.uploadedFiles[0].CloudFileName));
      this.uploadedFiles.splice(0);
    }

    this.uploadedFiles.push(this.fileToUpload);
    this.companyResourceUploadState.Resources = this.uploadedFiles;
    this.store.dispatch(new fromCompanyResourcesAddResourceActions.SaveCompanyResourcesUploadState(this.companyResourceUploadState));
    this.isFileSelected = true;
    this.unsafeUrlFound = false;
  }

  removeEventHandler(e: RemoveEvent) {
    e.data = { fileName: `${e.files[0].uid}_${e.files[0].name}` };
    this.isFileSelected = false;
  }

  removeResourceEventHandler(file: FileInfo) {
    const index = this.uploadedFiles.findIndex(f => f.Id === file.uid);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
    }

    this.uploadWidget.removeFilesByUid(file.uid);
    this.companyResourceUploadState.Resources = this.uploadedFiles;
    this.store.dispatch(new fromCompanyResourcesAddResourceActions.SaveCompanyResourcesUploadState(this.companyResourceUploadState));
    this.isFileSelected = false;
  }

  successEventHandler(e: SuccessEvent) {
    // successEventHandler gets fired multiple times for the remove operation with the latest call having a response.type of 4
    if (e.operation === 'upload' || (e.operation === 'remove' && e.response.type === 4)) {
      const uploadedFile = this.uploadedFiles.find(f => f.Id === e.files[0].uid);
      if (uploadedFile) {
        uploadedFile.Status = KendoUploadStatus.ScanInProgress;
        this.companyResourceUploadState.Resources = this.uploadedFiles;
        this.store.dispatch(new fromCompanyResourcesAddResourceActions.SaveCompanyResourcesUploadState(this.companyResourceUploadState));
      }
    }
  }

  errorEventHandler(e: any) {
    const uploadedFile = this.uploadedFiles.find(f => f.Id === e.files[0].uid);
    if (uploadedFile) {
      uploadedFile.Status = KendoUploadStatus.UploadFailed;
    }
    this.companyResourceUploadState.Resources = this.uploadedFiles;
    this.store.dispatch(new fromCompanyResourcesAddResourceActions.SaveCompanyResourcesUploadState(this.companyResourceUploadState));
  }

  cancelEventHandler(e: CancelEvent) {
    this.isFileSelected = false;
    this.fileToUpload = undefined;
  }

  getUploadStatus(file: FileInfo) {
    const attachment = this.uploadedFiles.find(f => f.Id === file.uid);
    if (attachment) {
      return attachment.Status;
    }
    return KendoUploadStatus.NotStarted;
  }

  getStatusClass(file: FileInfo) {
    const attachment = this.uploadedFiles.find(f => f.Id === file.uid);
    if (!attachment) {
      return 'upload-in-progress';
    }

    switch (attachment.Status) {
      case KendoUploadStatus.ScanSucceeded:
        return 'upload-success';
      case KendoUploadStatus.UploadFailed:
      case KendoUploadStatus.ScanFailed:
      case KendoUploadStatus.InvalidExtension:
        return 'upload-failed';
      default:
        return 'upload-in-progress';
    }
  }

  isResourceUrlProvided(): boolean {
    if (this.resourceForm.controls['urlName'].value) {
      return this.resourceForm.controls['urlName'].touched && this.resourceForm.controls['urlName'].value.trim().length > 0 ? true : false;
    } else {
      return false;
    }
  }

  onFormSubmit() {
    const scansComplete = this.uploadedFiles.length > 0 && this.uploadedFiles.every(f => f.Status === KendoUploadStatus.ScanSucceeded);

    if ((this.resourceForm.controls['resourceName'].valid && this.resourceForm.controls['urlName'].valid && !this.isFileSelected) ||
        (this.resourceForm.controls['resourceName'].valid && scansComplete && this.isFileSelected)) {
      this.store.dispatch(new fromCompanyResourcesActions.AddingCompanyResource(this.createResource()));
    }

    this.isFormSubmitted = true;
  }

  validateName(control: FormControl) {
    const folderName: string = control.value;
    const isEmptyString: boolean = /^ *$/.test(folderName);

    if (folderName) {
      if (folderName.trim().length === 0 || isEmptyString) {
        return {isNullOrWhiteSpace: true};
      }
    }

    return null;
  }

  validateUrl(control: FormControl) {
    const url: string = control.value;
    const isUrl: boolean = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(url) && url.trim().indexOf(' ') === -1;

    if (isUrl) {
      this.unsafeUrlFound = false;
      return null;
    }

    return { isInvalidUrl: true };
  }

  handleCancelClicked() {
    this.companyResourceUploadState = {
      Resources: [],
      IsModalOpen: false
    };
    this.store.dispatch(new fromCompanyResourcesAddResourceActions.SaveCompanyResourcesUploadState(this.companyResourceUploadState));
    this.activeModal.close();

    // TODO: Clean up orphaned cloud resource
    // this.store.dispatch(new fromCompanyResourcesAddResourceActions.DiscardCompanyResource(this.uploadedFiles[0].CloudFileName));
  }

  private createForm() {
    this.resourceForm = this.formBuilder.group({
      'resourceName': [undefined, {validators: [Validators.required, Validators.maxLength(100), this.validateName]}],
      'folderName': [undefined, {validators: [Validators.maxLength(50), this.validateName]}],
      'urlName': [undefined, {validators: [this.validateUrl.bind(this)], updateOn: 'blur'}],
      'kendoUpload': [undefined]
    });
  }

  private createSubscriptions() {
    this.folderResourceSubscription = this.folderResources$.subscribe((response) => {
      if (response) {
        this.folderResources = response;
      }
    });

    this.companyResourceUploadStateSubscription = this.companyResourceUploadState$.subscribe((response) => {
      if (response) {
        this.companyResourceUploadState = response;
        this.uploadedFiles = cloneDeep(response.Resources);
        this.updateUploadButtonState();
      }
    });

    this.companyResourceAddResourceModalOpenSubscription = this.companyResourceAddResourceModalOpen$.subscribe((response) => {
      if (response) {
        this.uploadedFilesKendo = [];
        this.uploadedFiles.forEach(file => {
          this.uploadedFilesKendo.push({name: file.Name, size: file.Size, uid: file.Id});
        });
      }
    });

    this.addingCompanyResourceErrorMsgSubscription = this.addingCompanyResourceErrorMsg$.subscribe((response) => {
      if (response) {
        this.addingCompanyResourceErrorMsg = response;
        this.unsafeUrlFound = true;
      }
    });
  }

  private createResource() {
    const folderValue = this.resourceForm.controls['folderName'].value ? this.resourceForm.controls['folderName'].value.trim() : null;
    const selectedFolder = folderValue ? this.folderResources.find(f => f.FolderName === folderValue) : null;
    const newResource = {
      CompanyResourcesFoldersId: selectedFolder ? selectedFolder.CompanyResourcesFoldersId : null,
      FileDisplayName: this.fileToUpload ? this.fileToUpload.Name : null,
      FileName: this.fileToUpload ? this.fileToUpload.CloudFileName : null,
      FolderName: folderValue,
      LinkUrl: this.resourceForm.controls['urlName'].value && !this.fileToUpload ?
        this.isHttpHttpsOrFtp(this.resourceForm.controls['urlName'].value.trim()) : null,
      ResourceTitle: this.resourceForm.controls['resourceName'].value,
      ResourceType: this.fileToUpload ? 'File' : 'Link'
    };

    return {Resource: newResource};
  }

  private isHttpHttpsOrFtp(url: string): string {
    return /^(http[s]?|ftp)|^$/i.test(url) ? url : `https://${url}`;
  }

  private mapFileInfoToKendoUpload(file: FileInfo, cloudFileName: string): KendoUpload {
    return {
      Id: file.uid,
      Name: file.name,
      Size: file.size,
      FileType: MappingHelper.mapFileExtensionToFileType(file.extension),
      CloudFileName: cloudFileName,
      Status: KendoUploadStatus.NotStarted
    };
  }

  private updateUploadButtonState() {
    const buttonElement = this.uploadWidget.wrapper.getElementsByClassName('k-upload-button');
    buttonElement[0].classList.remove('k-state-disabled');
  }
}
