import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

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
  private loadingError$: Observable<boolean>;
  private savingError$: Observable<boolean>;
  private savingSuccess$: Observable<boolean>;
  private jdmFooterViewSubscription: Subscription;
  private loadingErrorSubscription: Subscription;
  private savingErrorSubscription: Subscription;
  private savingSuccessSubscription: Subscription;
  public jdmFooterForm: FormGroup;
  public loadingError: boolean = false;
  public savingError: boolean = false;
  public savingSuccess: boolean = false;

  get createdByCheck() { return this.jdmFooterForm.controls['createdByCheck']; }
  get createdDateCheck() { return this.jdmFooterForm.controls['createdDateCheck']; }
  get versionNumberCheck() { return this.jdmFooterForm.controls['versionNumberCheck']; }
  get pageNumberCheck() { return this.jdmFooterForm.controls['pageNumberCheck']; }
  get customTextCheck() { return this.jdmFooterForm.controls['customTextCheck']; }
  get customTextValue() { return this.jdmFooterForm.controls['customTextValue']; }

  constructor(private store: Store<fromFooterViewReducer.State>, private formBuilder: FormBuilder) {
      this.buildForm();
      this.jdmFooterView$ = this.store.select(fromFooterViewReducer.getFooterViewObj);
      this.loadingError$ = this.store.select(fromFooterViewReducer.getLoadingError);
      this.savingError$ = this.store.select(fromFooterViewReducer.getSavingError);
      this.savingSuccess$ = this.store.select(fromFooterViewReducer.getSavingSuccess);
  }

  ngOnInit() {
      this.store.dispatch(new fromFooterViewAction.LoadFooterViewAction());

      this.jdmFooterViewSubscription = this.jdmFooterView$.subscribe(payload => {
        this.setFooterViewFormData(payload);
      });
      this.loadingErrorSubscription = this.loadingError$.subscribe(le => this.loadingError = le);
      this.savingErrorSubscription = this.savingError$.subscribe(se => this.savingError = se);
      this.savingSuccessSubscription = this.savingSuccess$.subscribe(ss => this.savingSuccess = ss);
  }

  ngOnDestroy() {
    this.jdmFooterViewSubscription.unsubscribe();
    this.loadingErrorSubscription.unsubscribe();
    this.savingErrorSubscription.unsubscribe();
    this.savingSuccessSubscription.unsubscribe();
  }

  buildForm() {
      this.jdmFooterForm = this.formBuilder.group({
        createdByCheck: [null],
        createdDateCheck: [null],
        versionNumberCheck: [null],
        pageNumberCheck: [null],
        customTextCheck: [null],
        customTextValue: ['', Validators.maxLength(40)]},
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
        return { 'valid': false };
    } else {
        return null;
    }
  }
}
