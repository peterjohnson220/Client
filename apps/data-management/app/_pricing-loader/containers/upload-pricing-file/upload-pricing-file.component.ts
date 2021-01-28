import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';

import { FileUploadComponent } from 'libs/features/loaders/org-data-loader/containers';
import { LoaderSettingKeyName } from 'libs/models/data-loads';
import { AsyncStateObj } from 'libs/models/state';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

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
  matchNotesSheetName$: Observable<string>;
  validationOnly$: Observable<boolean>;

  worksheetNamesSubscription: Subscription;
  pricingsSheetNameSubscription: Subscription;
  notesSheetNameSubscription: Subscription;
  matchNotesSheetNameSubscription: Subscription;
  validationOnlySubscription: Subscription;

  readonly validFileExtensions = ['.xlsx'];
  worksheetNamePlaceholder = 'Upload file to map tabs';
  selectedFile: File;
  pricingsSheetName: string;
  notesSheetName: string;
  matchNotesSheetName: string;
  duplicateSheetNamesError: boolean;
  validationOnly: boolean;

  pricingMatchNoteFeatureFlag: RealTimeFlag = {key: FeatureFlags.PricingMatchNotesTab, value: false};
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<fromPricingLoaderMainReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.worksheetNames$ = this.store.select(fromPricingLoaderMainReducer.getWorksheetNames);
    this.pricingsSheetName$ = this.store.select(fromPricingLoaderMainReducer.getPricingsSheetName);
    this.notesSheetName$ = this.store.select(fromPricingLoaderMainReducer.getPricingNotesSheetName);
    this.matchNotesSheetName$ = this.store.select(fromPricingLoaderMainReducer.getPricingMatchNotesSheetName);
    this.validationOnly$ = this.store.select(fromPricingLoaderMainReducer.getValidationOnly);
    this.featureFlagService.bindEnabled(this.pricingMatchNoteFeatureFlag, this.unsubscribe$);
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
    this.matchNotesSheetNameSubscription = this.matchNotesSheetName$.subscribe(value => this.matchNotesSheetName = value);
    this.validationOnlySubscription = this.validationOnly$.subscribe(value => this.validationOnly = value);
  }

  ngOnDestroy(): void {
    this.worksheetNamesSubscription.unsubscribe();
    this.pricingsSheetNameSubscription.unsubscribe();
    this.notesSheetNameSubscription.unsubscribe();
    this.matchNotesSheetNameSubscription.unsubscribe();
    this.validationOnlySubscription.unsubscribe();
    this.unsubscribe$.next();
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

  updateMatchNotesSheetName(value: string): void {
    this.store.dispatch(new fromUploadPricingFileActions.UpdateLoaderSetting({
      keyName: LoaderSettingKeyName.PricingMatchNotesSheetName,
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
      (!this.pricingsSheetName && !this.notesSheetName && !this.matchNotesSheetName) ||
      this.duplicatePricingAndNotesNameError || this.duplicatePricingAndMatchNotesNameError || this.duplicateNotesAndMatchNotesNameError;
  }

  public get duplicatePricingAndNotesNameError(): boolean {
    return !!this.pricingsSheetName?.length && !!this.notesSheetName?.length &&
      this.pricingsSheetName === this.notesSheetName;
  }
  public get duplicatePricingAndMatchNotesNameError(): boolean {
    return !!this.pricingsSheetName?.length && !!this.matchNotesSheetName?.length &&
      this.pricingsSheetName === this.matchNotesSheetName;
  }
  public get duplicateNotesAndMatchNotesNameError(): boolean {
    return !!this.notesSheetName?.length && !!this.matchNotesSheetName?.length &&
      this.notesSheetName === this.matchNotesSheetName;
  }
}
