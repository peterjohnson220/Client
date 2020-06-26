import { Component, Input, OnChanges, SimpleChanges, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { FileUploadComponent } from 'libs/features/org-data-loader/components';

import * as fromPricingLoaderMainReducer from '../../reducers';
import * as fromUploadPricingFileActions from '../../actions/upload-pricing-file.actions';

@Component({
  selector: 'pf-upload-pricing-file',
  templateUrl: './upload-pricing-file.component.html',
  styleUrls: ['./upload-pricing-file.component.scss']
})
export class UploadPricingFileComponent implements OnChanges, OnInit, OnDestroy {
  @Input() companyId: number;

  @ViewChild('fileUpload', { static: true }) public fileUpload: FileUploadComponent;
  worksheetNames$: Observable<AsyncStateObj<string[]>>;

  worksheetNamesSubscription: Subscription;

  readonly validFileExtensions = ['.xlsx', '.xlsm', '.xlsb'];
  worksheetNamePlaceholder = 'Upload file to map tabs';
  selectedFile: File;
  pricingsSheetName: string;
  notesSheetName: string;
  duplicateSheetNamesError: boolean;
  validationOnly: boolean;

  constructor(
    private store: Store<fromPricingLoaderMainReducer.State>
  ) {
    this.worksheetNames$ = this.store.select(fromPricingLoaderMainReducer.getWorksheetNames);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.companyId?.firstChange && changes.companyId.previousValue && !changes.companyId.currentValue) {
      this.fileUpload.ClearFile();
    }
  }

  ngOnInit(): void {
    this.worksheetNamesSubscription = this.worksheetNames$.subscribe(asynObj => {
      this.fileUpload.fileUploading = asynObj?.loading;
    });
  }

  ngOnDestroy(): void {
    this.worksheetNamesSubscription.unsubscribe();
  }

  handleOnFileDropped(event: File): void {
    if (!event) {
      return;
    }
    this.selectedFile = event;
    this.store.dispatch(new fromUploadPricingFileActions.GetWorksheetNames(this.selectedFile));
  }

  handleOnFileRemoved(): void {
    this.selectedFile = null;
    this.pricingsSheetName = null;
    this.notesSheetName = null;
    this.validationOnly = false;
    this.store.dispatch(new fromUploadPricingFileActions.ResetUploadState());
  }

  public get processDisabled(): boolean {
    return !this.companyId || !this.selectedFile ||
      (!this.pricingsSheetName && !this.notesSheetName) ||
      this.duplicateNameError;
  }

  public get duplicateNameError(): boolean {
    return !!this.pricingsSheetName?.length && !!this.notesSheetName?.length && (this.pricingsSheetName === this.notesSheetName);
  }
}
