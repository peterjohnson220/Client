import { Component, Input, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';

import { SuccessEvent, ErrorEvent, FileRestrictions, FileInfo, SelectEvent } from '@progress/kendo-angular-upload';

import { DeleteImageRequest, ImageControl, SaveImageRequest, StatementModeEnum } from '../../models';
import { HorizontalAlignment } from '../../types';

@Component({
  selector: 'pf-trs-image-control',
  templateUrl: './trs-image-control.component.html',
  styleUrls: ['./trs-image-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsImageControlComponent implements AfterViewInit, OnInit {
  @ViewChild('image') image: ElementRef;

  @Input() controlData: ImageControl;
  @Input() statementId: string;
  @Input() mode: StatementModeEnum;

  @Output() saveImage: EventEmitter<SaveImageRequest> = new EventEmitter();
  @Output() removeImage: EventEmitter<DeleteImageRequest> = new EventEmitter();
  @Output() imageLoaded: EventEmitter<string> = new EventEmitter();
  @Output() imageSelected: EventEmitter<void> = new EventEmitter();

  saveUrl = '/odata/TotalRewards/SaveStatementImage';
  statementModeEnum = StatementModeEnum;
  isServerError = false;
  selectedFiles: FileInfo[] = [];
  horizontalAlignment: HorizontalAlignment;

  // Kendo upload properties
  validFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
  invalidFileExtension = `Must be ${this.validFileExtensions.join(', ')}`;
  invalidMaxFileSize = 'Must be less than 1 MB.';
  uploadRestrictions: FileRestrictions = {
    allowedExtensions: this.validFileExtensions,
    maxFileSize: 1048576 // 1MB
  };

  ngOnInit(): void {
    this.setHorizontalAlignment();
  }

  ngAfterViewInit() {
    if (this.controlData.FileUrl) {
      this.image.nativeElement.addEventListener('load', () => { this.onImageLoaded(); });
    }
  }

  onImageLoaded() {
    this.imageLoaded.emit(this.controlData.Id);
    this.image.nativeElement.removeEventListener('load', this.onImageLoaded);
  }

  uploadImageSuccess(e: SuccessEvent) {
    this.selectedFiles = [];
    this.isServerError = false;
    const saveImageRequest = {
      ControlId: this.controlData.Id,
      FileName:  e.response.body.FileName as string,
      FileUrl: e.response.body.FileUrl as string
    };
    this.saveImage.emit(saveImageRequest);
  }

  uploadImageError(e: ErrorEvent) {
    this.selectedFiles = [];
    this.isServerError = true;
  }

  deleteImage() {
    this.removeImage.emit({FileName: this.controlData.FileName, Id: this.controlData.Id});
  }

  selectEventHandler(e: SelectEvent): void {
    this.selectedFiles = [];
    e.files.forEach((file) => this.selectedFiles.push(file));
    this.imageSelected.emit();
  }

  getFileValidation(file): string {
    if (file.validationErrors.includes('invalidFileExtension')) {
      return this.invalidFileExtension;
    }
    if (file.validationErrors.includes('invalidMaxFileSize')) {
      return this.invalidMaxFileSize;
    }
  }

  setHorizontalAlignment(): void {
    const horizontalAlignment = this.controlData.HorizontalAlignment?.toLocaleLowerCase();
    if (horizontalAlignment === 'left' || horizontalAlignment === 'right' || horizontalAlignment === 'center') {
      this.horizontalAlignment = horizontalAlignment;
    } else {
      this.horizontalAlignment = 'center';
    }
  }
}
