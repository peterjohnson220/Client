import { Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FileUploadHeaderRequestModel } from 'libs/features/org-data-loader/models';

import * as fromFileUploadReducer from '../../reducers';
import * as fromFileUploadActions from '../../actions/file-upload.actions';
import { ColumnNameRequestModel } from '../../models';

@Component({
  selector: 'pf-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Output() onFileDropped = new EventEmitter<any>();
  @Output() onColumnNamesRetrieved = new EventEmitter<any>();
  @Output() onFileRemoved = new EventEmitter();
  @Input() validFileExtensions: string[] = [];
  @Input() validFileStartsWith = '';
  @Input() delimiter: string;
  @Input() selectedFile: File = null;

  @ViewChildren('fileInput') fileInput;

  private fileUploadColumnNames$: Observable<ColumnNameRequestModel>;
  fileUploadRequest: FileUploadHeaderRequestModel;
  errorMessage = '';

  constructor(private store: Store<fromFileUploadReducer.State>) {
    this.fileUploadColumnNames$ = this.store.select(fromFileUploadReducer.getColumnNames);
    this.fileUploadColumnNames$.subscribe(f => {
      if (f !== null) {
        if (this.validFileStartsWith === f.entity) {
          this.onColumnNamesRetrieved.emit(f.columnNames);
        }
      }
    });
  }


  onFileDrop(event) {
    this.runValidation(event);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.runValidation(file);
  }

  GetColumnNames(file) {
    if (this.errorMessage.trim().length === 0) {
      this.fileUploadRequest = { delimiter: this.delimiter, file: file };
      this.store.dispatch(new fromFileUploadActions.GetColumnNames(
        { columnNamesFile: this.fileUploadRequest, columnNames: null, entity: this.validFileStartsWith }
      ));
    }
  }

  runValidation(file: File) {

    let msg = '';
    if (file !== undefined) {
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

      if (!this.delimiter || this.delimiter.toString().length === 0) {
        msg = 'Provide delimiter before continuing';
        this.errorMessage = msg;
        this.ClearFile();
        return;
      }

      this.errorMessage = msg;
      this.selectedFile = file;
      this.GetColumnNames(file);
      this.onFileDropped.emit(file);
    }
  }

  validateFileStartsWith(file: File): boolean {
    const startsWith = this.validFileStartsWith.trim();
    if (startsWith.length <= 0 || file.name.toLowerCase().startsWith(startsWith.toLowerCase())) {
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

      if (file.name.toLowerCase().endsWith(ext.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  public ClearFile() {
    this.onFileRemoved.emit();
    this.selectedFile = null;
    if (this.fileInput.first !== undefined) {
      this.fileInput.first.nativeElement.value = '';
    }
  }
}
