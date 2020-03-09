import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';


import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';

import { CompanyJobAttachment, CompanyJob } from 'libs/models';

@Component({
  selector: 'pf-job-attachments',
  templateUrl: './job-attachments.component.html',
  styleUrls: ['./job-attachments.component.scss']
})
export class JobAttachmentsComponent implements OnInit, OnDestroy {

  attachments$: Observable<CompanyJobAttachment[]>;
  jobFormData$: Observable<CompanyJob>;

  attachmentsSubscription: Subscription;

  attachments: CompanyJobAttachment[] = [];
  errorMessage = '';
  supportedFileFormats = ['.jpg', '.jpeg', '.png', '.doc', '.xls', '.xlsx', '.pdf', '.docx', '.txt', '.csv', '.zip', '.mp4', '.wmv', '.avi'];

  constructor(private store: Store<fromJobManagementReducer.State>) {
    this.attachments$ = this.store.select(fromJobManagementReducer.getAttachments);
    this.jobFormData$ = this.store.select(fromJobManagementReducer.getJobFormData);
  }

  ngOnInit() {
    this.attachmentsSubscription = this.attachments$.subscribe(value => {
      this.attachments = value;
    });
  }

  ngOnDestroy(): void {
    this.attachmentsSubscription.unsubscribe();
  }

  removeAttachment(fileName: string) {
    if (fileName) {
      this.store.dispatch(new fromJobManagementActions.RemoveAttachment(fileName));
    }
  }

  getJobTitle(jobTitle: string) {
    return jobTitle ? `the ${jobTitle}` : 'your new job';
  }

  uploadFiles(event: any) {
    const files: File[] = Array.from(event.target.files);

    if (this.attachments.length + files.length > 5) {
      this.errorMessage = ' - You cannot attach more than 5 files to a job';
    } else if (this.isInvalidFileExtension(files)) {
      this.errorMessage = ' - You are trying to upload an invalid file extension';
    } else if (this.isInvalidFileSize(files)) {
      this.errorMessage = ' - You are trying to upload a file larger than 10MB';
    } else if (files && files.length > 0) {
      this.store.dispatch(new fromJobManagementActions.UploadAttachments(files));
    }

    event.target.value = '';
  }

  isInvalidFileExtension(files: File[]): boolean {
    return files.filter(f => !this.supportedFileFormats.includes(`.${f.name.split('.').pop()}`)).length > 0;
  }

  isInvalidFileSize(files: File[]): boolean {
    return files.filter(f => f.size > 10000000).length > 0;
  }
}
