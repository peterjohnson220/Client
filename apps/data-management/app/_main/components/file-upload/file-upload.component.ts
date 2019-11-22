import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pf-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Output() onFileDropped = new EventEmitter<any>();
  @Output() onFileRemoved = new EventEmitter();
  @Input() validFileExtensions: string[] = [];
  @Input() validFileStartsWith = '';

  selectedFile: File = null;
  errorMessage = '';

  onFileDrop(event) {
    this.runValidation(event);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.runValidation(file);
  }

  runValidation(file: File) {

    let msg = '';
    if (!this.validateFileExtension(file)) {
      if (this.validFileExtensions.length === 1) {
        msg += `Valid file extensions: ${this.validFileExtensions.join(',')}`;
      }
      this.errorMessage = msg;
      this.ClearFile();
      return;
    }

    if (!this.validateFileStartsWith(file)) {
      msg = `File name must begin with "${this.validFileStartsWith}" `;
      this.errorMessage = msg;
      this.ClearFile();
      return;
    }

    this.errorMessage = msg;
    this.selectedFile = file;
    this.onFileDropped.emit(file);
  }

  validateFileStartsWith(file: File): boolean {
    const startsWith = this.validFileStartsWith.trim();
    if (startsWith.length <= 0 || file.name.startsWith(startsWith)) {
      return true;
    }

    return false;
  }

  validateFileExtension(file: File): boolean {

    if (!this.validFileExtensions || this.validFileExtensions.length === 0) {
      return true;
    }

    for (let ext of this.validFileExtensions) {
      if (!ext.startsWith('.')) {
        ext = '.' + ext;
      }

      if (file.name.endsWith(ext)) {
        return true;
      }
    }

    return false;
  }

  public ClearFile() {
    this.onFileRemoved.emit();
    this.selectedFile = null;
  }
}
