import { Component, Input, OnChanges, SimpleChanges, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { FileUploadComponent } from 'libs/features/org-data-loader/components';
import { LoaderSettingKeyName } from 'libs/models/data-loads';

import * as fromPricingLoaderMainReducer from '../../reducers';
import * as fromUploadPricingFileActions from '../../actions/upload-pricing-file.actions';

@Component({
  selector: 'pf-upload-pricing-file',
  templateUrl: './upload-pricing-file.component.html',
  styleUrls: ['./upload-pricing-file.component.scss']
})
export class UploadPricingFileComponent implements OnChanges, OnInit, OnDestroy {
  @Input() companyId: number;
  @Input() editing: boolean;
  @Output() processClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileUpload', { static: true }) public fileUpload: FileUploadComponent;
  worksheetNames$: Observable<AsyncStateObj<string[]>>;
  pricingsSheetName$: Observable<string>;
  notesSheetName$: Observable<string>;
  validationOnly$: Observable<boolean>;

  worksheetNamesSubscription: Subscription;
  pricingsSheetNameSubscription: Subscription;
  notesSheetNameSubscription: Subscription;
  validationOnlySubscription: Subscription;

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
    this.pricingsSheetName$ = this.store.select(fromPricingLoaderMainReducer.getPricingsSheetName);
    this.notesSheetName$ = this.store.select(fromPricingLoaderMainReducer.getPricingNotesSheetName);
    this.validationOnly$ = this.store.select(fromPricingLoaderMainReducer.getValidationOnly);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.companyId?.firstChange && changes.companyId?.previousValue && !changes.companyId.currentValue) {
      this.fileUpload.ClearFile();
    }
  }

  ngOnInit(): void {
    this.worksheetNamesSubscription = this.worksheetNames$.subscribe(asynObj => {
      this.fileUpload.fileUploading = asynObj?.loading;
    });
    this.pricingsSheetNameSubscription = this.pricingsSheetName$.subscribe(value => this.pricingsSheetName = value);
    this.notesSheetNameSubscription = this.notesSheetName$.subscribe(value => this.notesSheetName = value);
    this.validationOnlySubscription = this.validationOnly$.subscribe(value => this.validationOnly = value);
  }

  ngOnDestroy(): void {
    this.worksheetNamesSubscription.unsubscribe();
    this.pricingsSheetNameSubscription.unsubscribe();
    this.notesSheetNameSubscription.unsubscribe();
    this.validationOnlySubscription.unsubscribe();
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
    this.store.dispatch(new fromUploadPricingFileActions.ResetUploadState());
  }

  updatePricingsSheetName(value: string): void {
    this.store.dispatch(new fromUploadPricingFileActions.UpdateLoaderSetting({
      keyName: LoaderSettingKeyName.PricingsSheetName,
      keyValue: value
    }));
  }

  updateNotesSheetName(value: string): void {
    this.store.dispatch(new fromUploadPricingFileActions.UpdateLoaderSetting({
      keyName: LoaderSettingKeyName.PricingNotesSheetName,
      keyValue: value
    }));
  }

  updateValidationOnly(): void {
    this.store.dispatch(new fromUploadPricingFileActions.UpdateLoaderSetting({
      keyName: LoaderSettingKeyName.ValidateOnly,
      keyValue: this.validationOnly === true ? 'false' : 'true'
    }));
  }

  onProcessClicked(): void {
    this.processClicked.emit();
  }

  public get processDisabled(): boolean {
    return !this.companyId || this.editing || !this.selectedFile ||
      (!this.pricingsSheetName && !this.notesSheetName) ||
      this.duplicateNameError;
  }

  public get duplicateNameError(): boolean {
    return !!this.pricingsSheetName?.length && !!this.notesSheetName?.length && (this.pricingsSheetName === this.notesSheetName);
  }
}
