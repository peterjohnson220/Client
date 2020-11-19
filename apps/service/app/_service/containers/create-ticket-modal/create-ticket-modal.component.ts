import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { FileInfo, FileRestrictions, RemoveEvent, SelectEvent, SuccessEvent, UploadComponent, UploadEvent } from '@progress/kendo-angular-upload';

import * as fromRootState from 'libs/state/state';
import { PfValidators } from 'libs/forms/validators';
import { UserContext, UploadedFile, UserTicketDto } from 'libs/models';
import { Files } from 'libs/constants';

import * as fromServicesPageReducer from '../../reducers';
import * as fromServicesPageActions from '../../actions/service-page.actions';
import { TicketType, ServicePageConfig } from '../../models';

@Component({
  selector: 'pf-create-user-ticket',
  templateUrl: './create-ticket-modal.component.html',
  styleUrls: ['./create-ticket-modal.component.scss']
})
export class CreateTicketModalComponent {
  @ViewChild(UploadComponent) uploadComponent: UploadComponent;

  // observables
  userContext$: Observable<UserContext>;
  showUserTicketForm$: Observable<boolean>;
  ticketTypes$: Observable<TicketType[]>;
  saving$: Observable<boolean>;
  errorMessage$: Observable<string>;

  fileUploadMax = ServicePageConfig.MaxFileUploads;
  ticketForm: FormGroup;
  uploadSaveUrl = ServicePageConfig.UploadSaveUrl;
  uploadRemoveUrl = ServicePageConfig.UploadRemoveUrl;
  uploadedFilesData: UploadedFile[] = [];
  errorMessage = '';
  sameFileErrorMessage = '';
  uploadError = false;
  selectedTicketType: TicketType;

  get f() { return this.ticketForm.controls; }
  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: Files.VALID_FILE_EXTENSIONS,
    maxFileSize: Files.MAX_SIZE_LIMIT
  };

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ]
    }
  };

  constructor(
    private rootStore: Store<fromRootState.State>,
    public store: Store<fromServicesPageReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
    this.showUserTicketForm$ = this.store.pipe(select(fromServicesPageReducer.getShowNewTicketModal));
    this.ticketTypes$ = this.store.pipe(select(fromServicesPageReducer.getActiveTicketTypes));
    this.saving$ = this.store.pipe(select(fromServicesPageReducer.getSavingUserTicket));
    this.errorMessage$ = this.store.pipe(select(fromServicesPageReducer.getSavingUserTicketErrorMessage));
    this.createForm();
  }

  handleSelectionChange(ticketType: TicketType) {
    this.selectedTicketType = ticketType;
  }

  onDismiss() {
    this.store.dispatch(new fromServicesPageActions.ShowNewTicketModal(false));
    this.selectedTicketType = null;
    this.resetForm();
  }

  onSubmit() {
    const userTicket = this.getUserTicket();
    this.store.dispatch(new fromServicesPageActions.CreateUserTicket({ticket: userTicket, fileData: this.uploadedFilesData}));
  }

  private createForm(): void {
    this.ticketForm = this.formBuilder.group({
      TicketTitle: ['', [
        PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(50)]],
      TicketType: [null, [Validators.required]],
      UserTicket: ['', [PfValidators.richTextRequired]],
      IsPrivate: false,
      UserTicketState: 'New'
    });
  }

  // Upload events
  uploadEventHandler(e: UploadEvent) {
    this.resetError();
    this.ticketForm.markAsTouched();
  }

  successEventHandler(e: SuccessEvent) {
    if (e.operation === 'upload') {
      const file: UploadedFile = {
        DisplayName: e.files[0].name,
        FileName: e.response.body.value[0].FileName
      };
      this.uploadedFilesData.push(file);
    } else if (e.operation === 'remove') {
      this.uploadedFilesData.forEach((arrayItem) => {
        if (arrayItem.FileName === e.files[0].name) {
          const index = this.uploadedFilesData.indexOf(arrayItem);
          this.uploadedFilesData.splice(index, 1);
        }
      });
    }
  }

  onFileRemove(e: RemoveEvent) {
    this.uploadedFilesData.forEach((arrayItem) => {
      if (arrayItem.DisplayName === e.files[0].name) {
        e.files[0].name = arrayItem.FileName;
      }
    });
    this.resetError();
  }

  onFileSelect(e: SelectEvent) {
    this.uploadError = false;
    this.validateSelectedFiles(e.files);
    if (this.uploadError) {
      e.preventDefault();
    }
  }

  resetError(): void {
    this.uploadError = false;
    this.errorMessage = '';
  }

  private resetForm(): void {
     this.resetError();
     this.ticketForm.reset({
       IsPrivate: false,
       UserTicketState: 'New'
     });
    this.uploadedFilesData = [];
    this.uploadComponent.clearFiles();
  }

  private getUserTicket(): UserTicketDto {
    const userTicket: UserTicketDto = this.ticketForm.getRawValue();
    userTicket.UserTicketType = this.selectedTicketType.TicketTypeName;
    userTicket.FileType = this.selectedTicketType.TicketSubTypeName;
    return userTicket;
  }

  private validateSelectedFiles(files: FileInfo[]): void {
    const hasMatchingFileNames = files.find(f1 => this.uploadedFilesData.some(f2 => f1.name === f2.DisplayName));

    if (hasMatchingFileNames) {
      this.uploadError = true;
      this.errorMessage = '';
      this.sameFileErrorMessage = 'Upload contains file(s) with existing names. Please rename your file(s) and try again.';
      return;
    }

    if (files.length > this.fileUploadMax - this.uploadedFilesData.length) {
      this.uploadError = true;
      this.sameFileErrorMessage = '';
      this.errorMessage = 'The maximum number of files is ' + this.fileUploadMax + '.';
    }
  }
}
