import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromFooterViewReducer from '../reducers';
import * as fromFooterViewAction from '../actions';
import { FooterViewModel } from '../models';

@Component({
  selector: 'pf-footer-view.page',
  templateUrl: './footer-view.page.html',
  styleUrls: ['./footer-view.page.scss']
})
export class FooterViewPageComponent implements OnInit, OnDestroy {

  private jdmFooterView$: Observable<FooterViewModel>;
  public loading$: Observable<boolean>;
  public saving$: Observable<boolean>;
  private loadingSuccess$: Observable<boolean>;
  public loadingError$: Observable<boolean>;
  public savingError$: Observable<boolean>;
  public savingSuccess$: Observable<boolean>;
  private jdmFooterViewSubscription: Subscription;
  private loadingErrorSubscription: Subscription;
  private savingSuccessSubscription: Subscription;
  private loadingSuccessSubscription: Subscription;
  public jdmFooterForm: FormGroup;
  public loadingSuccess = false;
  public loadingError = false;
  public placeholderText = '';

  get createdByCheck() { return this.jdmFooterForm.controls['createdByCheck']; }
  get createdDateCheck() { return this.jdmFooterForm.controls['createdDateCheck']; }
  get versionNumberCheck() { return this.jdmFooterForm.controls['versionNumberCheck']; }
  get pageNumberCheck() { return this.jdmFooterForm.controls['pageNumberCheck']; }
  get customTextCheck() { return this.jdmFooterForm.controls['customTextCheck']; }
  get customTextValue() { return this.jdmFooterForm.controls['customTextValue']; }

  constructor(private store: Store<fromFooterViewReducer.State>, private formBuilder: FormBuilder) {
      this.buildForm();
      this.jdmFooterView$ = this.store.select(fromFooterViewReducer.getFooterViewObj);
      this.loading$ = this.store.select(fromFooterViewReducer.getLoading);
      this.saving$ = this.store.select(fromFooterViewReducer.getSaving);
      this.loadingError$ = this.store.select(fromFooterViewReducer.getLoadingError);
      this.savingError$ = this.store.select(fromFooterViewReducer.getSavingError);
      this.savingSuccess$ = this.store.select(fromFooterViewReducer.getSavingSuccess);
      this.loadingSuccess$ = this.store.select(fromFooterViewReducer.getLoadingSuccess);
  }

  ngOnInit() {
      this.store.dispatch(new fromFooterViewAction.LoadFooterViewAction());

      this.loadingSuccessSubscription = this.loadingSuccess$.subscribe(le => this.loadingSuccess = le);
      this.loadingErrorSubscription = this.loadingError$.subscribe(le => this.loadingError = le);
      this.savingSuccessSubscription = this.savingSuccess$.subscribe(ss => {
        this.jdmFooterForm.markAsPristine();
      });

      this.jdmFooterViewSubscription = this.jdmFooterView$.subscribe(payload => {
        if (this.loadingSuccess && !this.loadingError) {
          this.setFooterViewFormData(payload);
        }
      });
  }

  ngOnDestroy() {
    this.jdmFooterViewSubscription.unsubscribe();
    this.loadingErrorSubscription.unsubscribe();
    this.savingSuccessSubscription.unsubscribe();
  }

  buildForm() {
      this.jdmFooterForm = this.formBuilder.group({
        createdByCheck: [null],
        createdDateCheck: [null],
        versionNumberCheck: [null],
        pageNumberCheck: [null],
        customTextCheck: [null],
        customTextValue: ['', [Validators.maxLength(250)]]},
        { validator: this.maxCheckBoxCountValidator }
      );
  }

  submit() {
    if (this.jdmFooterForm.valid) {
      this.store.dispatch(new fromFooterViewAction.SaveFooterViewAction(this.getFooterViewFormData()));
    }
  }

  private getFooterViewFormData(): FooterViewModel {
    return {
      CreatedByField: this.createdByCheck.value,
      CreatedDateField: this.createdDateCheck.value,
      VersionNumberField: this.versionNumberCheck.value,
      PageNumberField: this.pageNumberCheck.value,
      CustomTextField: this.customTextCheck.value,
      CustomTextValueField: this.customTextValue.value
    };
  }

  private setFooterViewFormData(payload: FooterViewModel) {
    if (payload != null) {
      this.createdByCheck.setValue(payload.CreatedByField);
      this.createdDateCheck.setValue(payload.CreatedDateField);
      this.versionNumberCheck.setValue(payload.VersionNumberField);
      this.pageNumberCheck.setValue(payload.PageNumberField);
      this.customTextCheck.setValue(payload.CustomTextField);
      this.customTextValue.setValue(payload.CustomTextValueField);
      this.placeholderText = payload.CustomTextValueField === '' ? 'Custom Text, Limit 40 Characters' : '';
    }
  }

  private maxCheckBoxCountValidator = (control: AbstractControl): {[key: string]: boolean} => {
    let checkCount = 0;
    checkCount = control.get('createdByCheck').value === true ? checkCount + 1 : checkCount;
    checkCount = control.get('createdDateCheck').value === true ? checkCount + 1 : checkCount;
    checkCount = control.get('versionNumberCheck').value === true ? checkCount + 1 : checkCount;
    checkCount = control.get('pageNumberCheck').value === true ? checkCount + 1 : checkCount;
    checkCount = control.get('customTextCheck').value === true ? checkCount + 1 : checkCount;
    if (checkCount > 3) {
        return { 'customValidationError': true };
    } else {
        return null;
    }
  }
}
