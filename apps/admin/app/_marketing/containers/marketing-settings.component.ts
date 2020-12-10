import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as fromMarketingSettingsReducer from '../reducers';
import * as fromMarketingSettingsActions from 'libs/features/marketing-settings/marketing-settings.actions';

import { SelectEvent } from '@progress/kendo-angular-upload';
import { environment } from 'environments/environment';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

@Component({
  selector: 'pf-marketing-settings',
  templateUrl: './marketing-settings.component.html',
  styleUrls: ['./marketing-settings.component.scss'],
})
export class MarketingSettingsComponent implements OnInit, OnDestroy {

  saving$: Observable<boolean>;
  savingSuccess$: Observable<boolean>;
  getMarketingVideoUrl$: Observable<string>;
  getMarketingImage$: Observable<MarketingImageDto>;

  savingSuccessSubscription: Subscription;
  getMarketingVideoUrlSubscription: Subscription;
  getMarketingImageSubscription: Subscription;

  marketingImageLocation: any;
  marketingImageUrl: string;
  marketingVideoUrl: string;
  marketingForm: FormGroup;
  submitted = false;

  acceptedFileExtensions = ['.jpg', '.jpeg', '.png'];
  env = environment;
  uploadSaveUrl = '/odata/MarketingSettings.UploadMarketingImage';

  constructor(public store: Store<fromMarketingSettingsReducer.State>,
    private fb: FormBuilder) {
    this.getMarketingVideoUrl$ = this.store.select(fromMarketingSettingsReducer.getMarketingVideoUrl);
    this.getMarketingImage$ = this.store.select(fromMarketingSettingsReducer.getMarketingImage);
    this.saving$ = this.store.select(fromMarketingSettingsReducer.updatingMarketingSettings);
    this.savingSuccess$ = this.store.select(fromMarketingSettingsReducer.updatingMarketingSettingsSuccess);
    this.createForm();
  }

  get marketingVideoUrlControl() { return this.marketingForm.get('marketingVideoUrl'); }
  get marketingImageUrlControl() { return this.marketingForm.get('marketingImageUrl'); }

  ngOnInit(): void {
    this.store.dispatch(new fromMarketingSettingsActions.GetMarketingVideoUrl());
    this.store.dispatch(new fromMarketingSettingsActions.GetMarketingImage());

    this.savingSuccessSubscription  = this.savingSuccess$.subscribe(result => {
      if (result) {
        this.marketingForm.markAsUntouched();
      }
    });

    this.getMarketingVideoUrlSubscription = this.getMarketingVideoUrl$.subscribe(result => {
      if (result) {
        this.marketingVideoUrlControl.setValue(result);
      }
    });

    this.getMarketingImageSubscription = this.getMarketingImage$.subscribe(result => {
      if (result) {
        this.marketingImageLocation = result.Location;
        this.marketingImageUrlControl.setValue(result.RedirectUrl);
      }
    });

  }

  ngOnDestroy() {
    this.savingSuccessSubscription.unsubscribe();
    this.getMarketingVideoUrlSubscription.unsubscribe();
    this.getMarketingImageSubscription.unsubscribe();
  }

  createForm(): void {
    this.marketingForm = this.fb.group({
      marketingImageUrl: [this.marketingImageUrl, [Validators.required]],
      marketingVideoUrl: [this.marketingVideoUrl, [Validators.required]]
    });
  }

  selectEventHandler(e: SelectEvent) {
    const reader  = new FileReader();
    if (e.files[0].rawFile && (e.files[0].extension === '.jpg' || e.files[0].extension === '.png')) {
      reader.readAsDataURL(e.files[0].rawFile);
        reader.onloadend = () => {
          this.marketingImageLocation = reader.result;
        };
      } else {
        this.marketingImageLocation = '';
      }
  }

  removeEventHandler() {
    this.marketingImageLocation = '';
    this.marketingImageLocation = '';
  }

  handleSaveClicked() {
    if (!this.marketingForm.valid) {
      return;
    }
    this.marketingForm.markAsPristine();

    const formData = new FormData();
    formData.append('videoUrl', this.marketingVideoUrlControl.value);
    formData.append('imageUrl', this.marketingImageUrlControl.value);

    this.store.dispatch(new fromMarketingSettingsActions.UpdatingMarketingSettings(formData));
  }

  handleCancelClicked() {
   this.marketingForm.reset();
   this.marketingImageLocation = '';
  }
}
