import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorEvent, SelectEvent, UploadEvent,
    UploadProgressEvent, FileState, FileRestrictions, SuccessEvent, UploadComponent} from '@progress/kendo-angular-upload';

import { Files } from 'libs/constants';

import { KendoModelMapper, PayfactorsApiModelMapper } from '../../helpers';
import { UploadTicketAttachment } from '../../models';


@Component({
  selector: 'pf-attachment-upload',
  templateUrl: './attachment-upload.component.html',
  styleUrls: ['./attachment-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentUploadComponent implements OnInit, OnDestroy {
    @Input() ticketId: number;

    @Output() addAttachments = new EventEmitter();

    uploadUrl = '';
    uploadedFiles: Array<UploadTicketAttachment> = [];
    fileUploadProgress: string;
    fileRestrictions: FileRestrictions = {
        allowedExtensions: Files.VALID_FILE_EXTENSIONS,
        maxFileSize: Files.MAX_SIZE_LIMIT
    };

    @ViewChild(UploadComponent) uploadComponent: UploadComponent;

    constructor() { }

    ngOnInit() {
        if (this.ticketId) {
            this.uploadUrl = `/odata/Ticket/AddAttachment/${this.ticketId}`;
        }
    }

    ngOnDestroy() { }

    selectEventHandler(e: SelectEvent) {
        e.files.forEach((file) => this.uploadedFiles.push(KendoModelMapper.mapFileInfoToUploadTicketAttachment(file)));
    }

    uploadProgressEventHandler(e: UploadProgressEvent) {
        this.uploadedFiles.find(file => file.uid === e.files[0].uid).uploadProgress =
            parseFloat(e.percentComplete.toFixed(2));
    }

    beginUploadEventHandler(e: UploadEvent) {
        this.uploadedFiles.find(file => file.uid === e.files[0].uid).state = FileState.Uploading;
    }

    errorEventHandler(e: ErrorEvent) {
        let errors = [];
        if (e.response instanceof HttpErrorResponse) {
            if (e.response.error.error) {
                errors = e.response.error.error.message.split(',');
                this.uploadedFiles.find(file => file.uid === e.files[0].uid).validationErrors = errors;
            } else {
                this.uploadedFiles.find(file => file.uid === e.files[0].uid).validationErrors = ['genericError'];
            }
        }
        this.uploadedFiles.find(file => file.uid === e.files[0].uid).state = FileState.Failed;
    }

    uploadSuccessEventHandler(e: SuccessEvent) {
        if (e.response.body) {
            const attachments =
                PayfactorsApiModelMapper.mapUserTicketFilesToTicketAttachment(e.response.body, FileState.Uploaded);
            this.addAttachments.emit(attachments);
            this.uploadedFiles = this.uploadedFiles.filter((uf) => {
                return uf.uid !== e.files[0].uid;
            });
        }
    }

    removeFileClick(file: UploadTicketAttachment) {
        if (file.state === FileState.Failed) {
            this.uploadedFiles = this.uploadedFiles.filter((uf) => {
                return uf.uid !== file.uid;
            });
            return;
        }
    }

    retryFileUpload(fileId: string) {
        if (fileId) {
            this.uploadComponent.retryUploadByUid(fileId);
        }
    }
}
