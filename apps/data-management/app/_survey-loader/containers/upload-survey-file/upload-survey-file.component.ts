import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';

import { FileUploadComponent } from 'libs/features/loaders/org-data-loader/containers';
import { LoaderSettingKeyName } from 'libs/models/data-loads';
import { AsyncStateObj } from 'libs/models/state';
import * as fromSurveyLoaderMainReducer from '../../reducers';
import * as fromUploadSurveyFileActions from '../../actions/upload-survey-file.actions';
import {
  getSurveySheetInit,
  SurveySheetModel
} from '../../models';

@Component({
  selector: 'pf-upload-survey-file',
  templateUrl: './upload-survey-file.component.html',
  styleUrls: ['./upload-survey-file.component.scss']
})
export class UploadSurveyFileComponent implements OnInit, OnDestroy {
  @Output() processClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileUpload', { static: true }) public fileUpload: FileUploadComponent;

  worksheetNames$: Observable<AsyncStateObj<string[]>>;
  surveyJobSheetName$: Observable<string>;
  surveyDataSheetName$: Observable<string>;
  surveyParticipationSheetName$: Observable<string>;
  validationOnly$: Observable<boolean>;

  worksheetNamesSubscription: Subscription;
  surveyJobSheetNameSubscription: Subscription;
  surveyDataSheetNameSubscription: Subscription;
  surveyParticipationSheetNameSubscription: Subscription;
  validationOnlySubscription: Subscription;

  readonly validFileExtensions = ['.xlsx'];
  selectedFile: File;
  surveyJobSheetName: SurveySheetModel[];
  surveyDataSheetName: SurveySheetModel[];
  surveyParticipationSheetName: SurveySheetModel[];
  isDuplicateSheetName: boolean;
  duplicateSheetNamesErrors: string[];
  validationOnly: boolean;
  surveyAdditionalTab = { SurveyJobTab: false, SurveyDataTab: false, SurveyParticipationTab: false};
  isDisabledSurveyAdditionalTab = false;
  loaderSettings = LoaderSettingKeyName;
  unsubscribe$ = new Subject<void>();
  NextBtnToolTips: string[] = [
    'Only 5 tabs can be mapped per entity'
  ];
  readonly maxTap = 5;

  constructor(
    private store: Store<fromSurveyLoaderMainReducer.State>) {
    this.worksheetNames$ = this.store.select(fromSurveyLoaderMainReducer.getWorksheetNames);
    this.surveyJobSheetName$ = this.store.select(fromSurveyLoaderMainReducer.getSurveyJobSheetName);
    this.surveyDataSheetName$ = this.store.select(fromSurveyLoaderMainReducer.getSurveyDataSheetName);
    this.surveyParticipationSheetName$ = this.store.select(fromSurveyLoaderMainReducer.getSurveyParticipationSheetName);
    this.validationOnly$ = this.store.select(fromSurveyLoaderMainReducer.getValidationOnly);
  }

  ngOnInit(): void {
    this.worksheetNamesSubscription = this.worksheetNames$.subscribe(asynObj => {
      this.fileUpload.fileUploading = asynObj?.loading;
    });
    this.surveyJobSheetNameSubscription = this.surveyJobSheetName$.subscribe(value => {
      this.surveyJobSheetName = value === null ? getSurveySheetInit() : JSON.parse(value);
      this.duplicateSurveySheetError();
    });
    this.surveyDataSheetNameSubscription = this.surveyDataSheetName$.subscribe(value => {
      this.surveyDataSheetName = value === null ? getSurveySheetInit() : JSON.parse(value);
      this.duplicateSurveySheetError();
    });
    this.surveyParticipationSheetNameSubscription = this.surveyParticipationSheetName$.subscribe(value => {
      this.surveyParticipationSheetName = value === null ? getSurveySheetInit() : JSON.parse(value);
      this.duplicateSurveySheetError();
    });
    this.validationOnlySubscription = this.validationOnly$.subscribe(value => this.validationOnly = value);
  }

  ngOnDestroy(): void {
    this.worksheetNamesSubscription.unsubscribe();
    this.surveyJobSheetNameSubscription.unsubscribe();
    this.surveyDataSheetNameSubscription.unsubscribe();
    this.surveyParticipationSheetNameSubscription.unsubscribe();
    this.validationOnlySubscription.unsubscribe();
    this.unsubscribe$.next();
  }

  handleOnFileDropped(event: File): void {
    if (!event) {
      return;
    }
    this.selectedFile = event;
    this.store.dispatch(new fromUploadSurveyFileActions.GetWorksheetNames(this.selectedFile));
  }

  handleOnFileRemoved(): void {
    this.selectedFile = null;
    this.store.dispatch(new fromUploadSurveyFileActions.ResetUploadState());
  }

  updateSurveyJobSheetName(value: string, surveySheetId: number): void {
    this.surveyJobSheetName.map(sjs => {
      sjs.Value = sjs.Id === surveySheetId ? (value === undefined ? null : value) : sjs.Value;
    });
    this.updateSurveySheetName(LoaderSettingKeyName.SurveyJobsSheetName, this.surveyJobSheetName);
  }

  updateSurveyDataSheetName(value: string, surveySheetId: number): void {
    this.surveyDataSheetName.map(sds => {
      sds.Value = sds.Id === surveySheetId ? (value === undefined ? null : value) : sds.Value;
    });
    this.updateSurveySheetName(LoaderSettingKeyName.SurveyDataSheetName, this.surveyDataSheetName);
  }

  updateSurveyParticipationSheetName(value: string, surveySheetId: number): void {
    this.surveyParticipationSheetName.map(sps => {
      sps.Value = sps.Id === surveySheetId ? (value === undefined ? null : value) : sps.Value;
    });
    this.updateSurveySheetName(LoaderSettingKeyName.SurveyParticipationSheetName, this.surveyParticipationSheetName);
  }

  updateSurveySheetName(loaderSetting: LoaderSettingKeyName, surveySheet: SurveySheetModel[]): void {
    this.store.dispatch(new fromUploadSurveyFileActions.UpdateLoaderSetting({
      keyName: loaderSetting,
      keyValue: JSON.stringify(surveySheet)
    }));
  }

  updateValidationOnly(): void {
    this.store.dispatch(new fromUploadSurveyFileActions.UpdateLoaderSetting({
      keyName: LoaderSettingKeyName.ValidateOnly,
      keyValue: this.validationOnly === true ? 'false' : 'true'
    }));
  }

  removeAdditionalDropdown(loaderSetting: LoaderSettingKeyName, surveySheetId: number): void {
    this.isDisabledSurveyAdditionalTab = false;
    switch (loaderSetting) {
      case LoaderSettingKeyName.SurveyJobsSheetName: {
        this.surveyJobSheetName = this.surveyJobSheetName.filter(sjs => sjs.Id !== surveySheetId);
        this.updateSurveySheetName(loaderSetting, this.surveyJobSheetName);
        break;
      }
      case LoaderSettingKeyName.SurveyDataSheetName: {
        this.surveyDataSheetName = this.surveyDataSheetName.filter(sds => sds.Id !== surveySheetId);
        this.updateSurveySheetName(loaderSetting, this.surveyDataSheetName);
        break;
      }
      case LoaderSettingKeyName.SurveyParticipationSheetName: {
        this.surveyParticipationSheetName = this.surveyParticipationSheetName.filter(sps => sps.Id !== surveySheetId);
        this.updateSurveySheetName(loaderSetting, this.surveyParticipationSheetName);
        break;
      }
    }
  }

  addAdditionalDropdown(loaderSetting: LoaderSettingKeyName, surveySheets: SurveySheetModel[]): void {
    if (surveySheets.length < this.maxTap) {
      switch (loaderSetting) {
        case LoaderSettingKeyName.SurveyJobsSheetName: {
          this.surveyJobSheetName.push({Id: this.getNewId(this.surveyJobSheetName), Value: null});
          break;
        }
        case LoaderSettingKeyName.SurveyDataSheetName: {
          this.surveyDataSheetName.push({Id: this.getNewId(this.surveyDataSheetName), Value: null});
          break;
        }
        case LoaderSettingKeyName.SurveyParticipationSheetName: {
          this.surveyParticipationSheetName.push({Id: this.getNewId(this.surveyParticipationSheetName), Value: null});
          break;
        }
      }
    }
  }

  getNewId(surveySheets: SurveySheetModel[]): number {
    return surveySheets.map(ss => ss.Id).
        reduce((prev, next) => next ? prev + next : prev) + 1;
  }

  onProcessClicked(): void {
    this.processClicked.emit();
  }

  public get processDisabled(): boolean {
    return !this.selectedFile || this.isSurveySheetEmpty || this.isDuplicateSheetName;
  }

  public get isSurveySheetEmpty(): boolean {
    const isSurveyJobEmpty = this.surveyJobSheetName.some(sjs => sjs.Value !== null);
    const isSurveyDataEmpty = this.surveyDataSheetName.some(sds => sds.Value !== null);
    const isSurveyParticipationEmpty = this.surveyParticipationSheetName.some(sps => sps.Value !== null);
    return !isSurveyJobEmpty && !isSurveyDataEmpty && !isSurveyParticipationEmpty;
  }

  public duplicateSurveySheetError(): void {
    if (this.surveyJobSheetName && this.surveyDataSheetName && this.surveyParticipationSheetName) {
      this.duplicateSheetNamesErrors = [];
      this.duplicateNames.forEach(duplicated => {
        this.duplicateSheetNamesErrors.push('Tab ' + duplicated + ' is duplicated');
      });
      this.isDuplicateSheetName = this.duplicateSheetNamesErrors.length > 0;
    }
  }

  public get duplicateNames(): string[] {
    const duplicated = [];
    const surveySheetNames = this.surveyJobSheetName.concat(this.surveyDataSheetName).concat(this.surveyParticipationSheetName);
    surveySheetNames.forEach(ssn => {
      if (duplicated.indexOf(ssn.Value) === - 1 && surveySheetNames.filter(sn => sn.Value !== null && sn.Value === ssn.Value).length > 1) {
        duplicated.push(ssn.Value);
      }
    });
    return duplicated;
  }

  public clearFile(): void {
    this.fileUpload.ClearFile();
  }
}


