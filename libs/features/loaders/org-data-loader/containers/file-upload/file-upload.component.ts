import { Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ColumnNameRequestModel, FileUploadHeaderRequestModel } from 'libs/features/loaders/org-data-loader/models';

import * as fromFileUploadReducer from '../../reducers';
import * as fromFileUploadActions from '../../actions';

@Component({
  selector: 'pf-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Output() onFileDropped = new EventEmitter<any>();
  @Output() onColumnNamesRetrieved = new EventEmitter<any>();
  @Output() onFileRemoved = new EventEmitter();
  @Output() onLoadingFinished = new EventEmitter<any>();
  @Input() validFileExtensions: string[] = [];
  @Input() validFileStartsWith = '';
  @Input() delimiter: string;
  @Input() selectedFile: File = null;
  @Input() autoGetColumnNames = true;
  @Input() QAInputId: string = null;

  @ViewChildren('fileInput') fileInput;

  private fileUploadColumnNames$: Observable<ColumnNameRequestModel[]>;
  fileUploadRequest: FileUploadHeaderRequestModel;
  fileUploading = false;
  errorMessage = '';

  constructor(private store: Store<fromFileUploadReducer.State>) {
    this.fileUploadColumnNames$ = this.store.select(fromFileUploadReducer.getColumnNames);
    this.fileUploadColumnNames$.subscribe(f => {
      if (f !== null) {
        const entityColumnNames = f.find(item => item.entity === this.validFileStartsWith);
        if (entityColumnNames) {
          this.fileUploading = false;
          this.onFileDropped.emit(this.selectedFile);
          this.onColumnNamesRetrieved.emit(entityColumnNames.columnNames);
          this.onLoadingFinished.emit(true);
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
      this.onLoadingFinished.emit(false);
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

      if (this.autoGetColumnNames) {
        if (!this.delimiter || this.delimiter.toString().length === 0) {
          msg = 'Provide delimiter before continuing';
          this.errorMessage = msg;
          this.ClearFile();
          return;
        }
      }

      this.errorMessage = msg;
      this.selectedFile = file;
      if (this.autoGetColumnNames) {
        this.GetColumnNames(file);
        this.fileUploading = true;
      } else {
        this.onFileDropped.emit(this.selectedFile);
      }
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

  public ClearErrorMessage() {
    this.errorMessage = '';
  }
}
