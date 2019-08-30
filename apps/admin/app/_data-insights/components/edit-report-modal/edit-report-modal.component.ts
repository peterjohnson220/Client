import { Component, ViewChild, Input, EventEmitter, OnInit, OnChanges, SimpleChanges,
  ChangeDetectionStrategy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessEvent, ErrorEvent, FileRestrictions, UploadProgressEvent, SelectEvent } from '@progress/kendo-angular-upload';

import { StandardReportDetails, EditReportFormData, StandardReportThumbnailData } from '../../models';

@Component({
  selector: 'pf-edit-report-modal',
  templateUrl: './edit-report-modal.component.html',
  styleUrls: ['./edit-report-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditReportModalComponent implements OnInit, OnChanges {
  @Input() report: StandardReportDetails;
  @Input() cloudFilesPublicBaseUrl: string;
  @Input() saving: boolean;
  @Output() saveClicked: EventEmitter<EditReportFormData> = new EventEmitter();

  @ViewChild('editReportModal', { static: true }) public editReportModal: any;
  editReportForm: FormGroup;
  thumbnailUrl: string;
  uploadedFileName: string;
  uploadThumbnailUrl: string;
  thumbnailRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };
  errorMessage: string;
  uploadingThumbnail: boolean;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.uploadThumbnailUrl = StandardReportThumbnailData.UploadThumbnailUrl;
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.report && !!changes.report.currentValue) {
      this.updateForm();
    }
  }

  get saveDisabled(): boolean {
    if (!this.editReportForm) {
      return this.saving;
    }

    return this.saving || !this.editReportForm.valid || !(this.editReportForm.dirty || this.editReportForm.touched)
      || this.uploadingThumbnail;
  }

  createForm(): void {
    this.editReportForm = this.formBuilder.group({
      displayName: ['', [Validators.maxLength(255)]],
      summary: ['', [Validators.maxLength(300)]]
    });
  }

  updateForm(): void {
    if (!this.report) {
      return;
    }
    this.editReportForm.patchValue({
      displayName: this.report.DisplayName,
      summary: this.report.Summary
    });
    this.thumbnailUrl = this.report.ThumbnailUrl;
    this.uploadingThumbnail = false;
    this.uploadedFileName = null;
    this.errorMessage = '';
  }

  open(): void {
    this.modalService.open(this.editReportModal, { backdrop: 'static', windowClass: 'edit-report-modal' });
  }

  close(): void {
    this.updateForm();
    this.modalService.dismissAll();
  }

  save(): void {
    const formData = this.buildFormData();
    this.saveClicked.emit(formData);
  }

  selectEventHandler(e: SelectEvent): void {
    e.files.forEach(file => {
      if (!!file.validationErrors) {
        this.uploadingThumbnail = false;
        this.errorMessage = 'Only accepts .jpg or .png files under 4Mb.';
      } else {
        this.errorMessage = '';
      }
    });
  }

  uploadProgressEventHandler(e: UploadProgressEvent): void {
    this.uploadingThumbnail = true;
  }

  successEventHandler(e: SuccessEvent): void {
    this.uploadingThumbnail = false;
    const fileName = e.response.body.value;
    this.thumbnailUrl = `${this.cloudFilesPublicBaseUrl}/${StandardReportThumbnailData.CloudFilesContainer}/${fileName}`;
    this.uploadedFileName = fileName;
  }

  errorEventHandler(e: ErrorEvent): void {
    this.uploadingThumbnail = false;
    this.errorMessage = e.response['message'] + ': ' + e.response['error']['value'];
  }

  private buildFormData(): EditReportFormData {
    const formData: EditReportFormData = {
      WorkbookId: this.report.Id,
      DisplayName: this.editReportForm.value.displayName || this.report.Name,
      Summary: this.editReportForm.value.summary,
      ThumbnailUrl: this.uploadedFileName
    };
    return formData;
  }
}
