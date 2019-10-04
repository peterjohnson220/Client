import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FileRestrictions, UploadEvent, FileInfo, RemoveEvent, SuccessEvent, CancelEvent } from '@progress/kendo-angular-upload';
import { CompanyResourceFolder } from '../../models';
import { UploadedFile } from 'libs/models/service';
import * as fromCompanyResourcesReducer from '../../reducers';
import * as fromCompanyResourcesActions from '../../actions/company-resources.actions';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'pf-resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.scss']
})
export class ResourceModalComponent implements OnInit, OnDestroy {
  headerStatusUploadedMsg = 'Ready';
  headerStatusUploadingMsg = 'Preparing file for upload...';
  validFileExtensions = ['.jpg', '.jpeg', '.png', '.doc', '.xls', '.xlsx', '.pdf', '.docx', '.txt', '.csv', '.zip', '.mp4', '.wmv', '.avi'];
  invalidFileExtensionMsg = `File type not allowed. Permitted file extensions are ${this.validFileExtensions.toString()}`;
  invalidMaxFileSizeMsg = 'File size too large.  The file must be less than 150 MB';
  removeResourceUrl = '/odata/CloudFiles.DeleteCompanyResources';
  saveResourceUrl = '/odata/CloudFiles.UploadCompanyResource';

  fileRestrictions: FileRestrictions = {
    allowedExtensions: this.validFileExtensions,
    maxFileSize: 157286400 // 150 MB
  };

  folderResources$: Observable<CompanyResourceFolder[]>;

  addingResource$: Observable<boolean>;
  addingResourceSuccess$: Observable<boolean>;
  isUploadSuccess = false;

  folderResources: CompanyResourceFolder[];
  fileToUpload: FileInfo;
  isFileSelected: boolean;
  isSubmitDisabled: boolean;
  resourceForm: FormGroup;
  uploadedFileData: UploadedFile;

  uploadFiles: FileInfo[];

  private folderResourceSubscription: Subscription;

  constructor(
    private store: Store<fromCompanyResourcesReducer.State>,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.addingResource$ = this.store.select(fromCompanyResourcesReducer.getAddingCompanyResource);
    this.addingResourceSuccess$ = this.store.select(fromCompanyResourcesReducer.getAddingCompanyResourceSuccess);
    this.folderResources$ = this.store.select(fromCompanyResourcesReducer.getCompanyFolderResources);

    this.createSubscriptions();
    this.createForm();
  }

  ngOnDestroy() {
    this.folderResourceSubscription.unsubscribe();
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
    const isUrl: boolean = /^(http[s]?:\/\/|ftp:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}$|^$/i.test(url);

    return isUrl ? null : {isInvalidUrl: true};
  }

  isResourceUrlProvided(): boolean {
    if (this.resourceForm.controls['urlName'].value) {
      return this.resourceForm.controls['urlName'].touched && this.resourceForm.controls['urlName'].value.trim().length > 0 ? true : false;
    } else {
      return false;
    }
  }

  removeEventHandler(e: RemoveEvent) {
    e.files[0].name = this.uploadedFileData.FileName;
    this.isFileSelected = false;
  }

  uploadEventHandler(e: UploadEvent) {
    const file = e.files[0];
    this.fileToUpload = file;
    this.isSubmitDisabled = false;
    this.isFileSelected = true;
  }

  successEventHandler(e: SuccessEvent) {
    if (e.response.ok && e.operation === 'upload') {
      this.uploadedFileData = {
        DisplayName: e.response.body.value[0].DisplayName,
        FileName: e.response.body.value[0].FileName
      };
      this.resourceForm.controls['urlName'].setErrors(null);
    } else if (e.response.ok && e.operation === 'remove') {
      this.uploadedFileData = null;
    }
  }

  cancelEventHandler(e: CancelEvent) {
    this.isFileSelected = false;
    this.fileToUpload = undefined;
  }

  invalidFormMessage(): string {
    if ( (this.resourceForm.controls['resourceName'].dirty && this.resourceForm.controls['resourceName'].invalid) ) {
      return 'Please enter a title for this resource.';
    } else if ((this.resourceForm.controls['urlName'].dirty && this.resourceForm.controls['urlName'].invalid) && this.resourceForm.controls['urlName'].value) {
      return 'Please enter a valid URL for this resource.';
    } else {
      this.resourceForm.setErrors(null);
    }
  }

  onFormSubmit() {
    if (this.resourceForm.valid) {
      this.store.dispatch(new fromCompanyResourcesActions.AddingCompanyResource(this.createResource()));
    }
  }

  private createForm() {
    this.resourceForm = this.formBuilder.group({
      'resourceName': ['', {validators: [Validators.required, Validators.maxLength(50), this.validateName], updateOn: 'blur'}],
      'folderName': ['', {validators: [Validators.maxLength(50), this.validateName]}],
      'urlName': ['', {validators: [this.validateUrl], updateOn: 'blur'}],
      'kendoUpload': ['']
    }, {
      validator: (formControl) => {
        const urlName = formControl.controls['urlName'];
        const kendoUpload = formControl.controls['kendoUpload'];

        if (urlName !== undefined && kendoUpload !== undefined) {
          if ( !((urlName.value && urlName.value.length) || (kendoUpload.value && kendoUpload.value.length )) ) {
            return {invalidUrlOrFile: true};
          }
        }
      }
    });
  }

  private createSubscriptions() {
    this.folderResourceSubscription = this.folderResources$.subscribe((response) => {
      if (response) {
        this.folderResources = response;
      }
    });
  }

  private createResource() {
    const folderValue = this.resourceForm.controls['folderName'].value ? this.resourceForm.controls['folderName'].value.trim() : null;
    const selectedFolder = folderValue ? this.folderResources.find(f => f.FolderName === folderValue) : null;
    const newResource = {
      CompanyResourcesFoldersId: selectedFolder ? selectedFolder.CompanyResourcesFoldersId : null,
      FileDisplayName: this.uploadedFileData ? this.uploadedFileData.DisplayName : null,
      FileName: this.uploadedFileData ? this.uploadedFileData.FileName : null,
      FolderName: folderValue,
      LinkUrl: this.resourceForm.controls['urlName'].value && !this.fileToUpload ?
        this.isHttpHttpsOrFtp(this.resourceForm.controls['urlName'].value.trim()) : null,
      ResourceTitle: this.resourceForm.controls['resourceName'].value,
      ResourceType: this.fileToUpload ? 'File' : 'Link'
    };

    return {Resource: newResource};
  }

  private isHttpHttpsOrFtp(url: string): string {
    return /^(http[s]?|ftp){0,1}$|^$/i.test(url) ? url : `https://${url}`;
  }
}
