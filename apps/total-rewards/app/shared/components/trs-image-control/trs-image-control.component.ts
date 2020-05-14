import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';

import { SuccessEvent, ErrorEvent, FileRestrictions } from '@progress/kendo-angular-upload';

import { DeleteImageRequest, ImageControl, SaveImageRequest, StatementModeEnum } from '../../models/';

@Component({
  selector: 'pf-trs-image-control',
  templateUrl: './trs-image-control.component.html',
  styleUrls: ['./trs-image-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsImageControlComponent {

  @Input() controlData: ImageControl;
  @Input() statementId: string;
  @Input() mode: StatementModeEnum;

  @Output() saveImage: EventEmitter<SaveImageRequest> = new EventEmitter();
  @Output() removeImage: EventEmitter<DeleteImageRequest> = new EventEmitter();

  saveUrl = '/odata/TotalRewards/SaveStatementImage';
  statementModeEnum = StatementModeEnum;
  isInvalidError = false;
  isServerError = false;

  // Kendo upload properties
  validFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
  invalidFileExtension = `Must be ${this.validFileExtensions.join(', ')}`;
  invalidMaxFileSize = 'Must be less than 1 MB.';
  uploadRestrictions: FileRestrictions = {
    allowedExtensions: this.validFileExtensions,
    maxFileSize: 1048576 // 1MB
  };

  constructor() { }

  uploadImageSuccess(e: SuccessEvent) {
    this.isInvalidError = false;
    this.isServerError = false;
    const saveImageRequest = {
      ControlId: this.controlData.Id,
      FileName:  e.response.body.FileName as string,
      FileUrl: e.response.body.FileUrl as string
    };
    this.saveImage.emit(saveImageRequest);
  }

  uploadImageError(e: ErrorEvent) {
    this.isInvalidError = true;
    this.isServerError = true;
  }

  deleteImage() {
    this.removeImage.emit({FileName: this.controlData.FileName, Id: this.controlData.Id});
  }

  getFileValidation(file): string {
    if (file.validationErrors.includes('invalidFileExtension')) {
      this.isInvalidError = true;
      return this.invalidFileExtension;
    }
    if (file.validationErrors.includes('invalidMaxFileSize')) {
      this.isInvalidError = true;
      return this.invalidMaxFileSize;
    }
  }

}
