import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { timer as observableTimer, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import { PfValidators } from 'libs/forms/validators';
import { Exchange } from 'libs/models/peer';

import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromCompanyIndustriesActions from '../../../actions/company-industries.actions';

@Component({
  selector: 'pf-new-company-form',
  templateUrl: './new-company-form.component.html',
  styleUrls: ['./new-company-form.component.scss']
})

export class NewCompanyFormComponent implements OnInit {
  @ViewChild('companyIndustriesComboBox') companyIndustriesComboBox: ComboBoxComponent;
  @Input() exchange: Exchange;
  @Input() requestCompanyForm: FormGroup;

  companyIndustries$: Observable<string[]>;
  companyIndustriesLoading$: Observable<boolean>;
  companyIndustriesLoadingError$: Observable<boolean>;
  exchangeCompanyRequesting$: Observable<boolean>;
  companyIndustriesSubscription: Subscription;
  companyIndustries: string[];
  companyIndustriesFiltered: string[];
  companyNameValidationText = `Company name must be at least 3 characters, unique for this exchange
              (including existing requests) and cannot be an existing company. If it is an existing company,
              try clicking the 'Existing Companies' link below.`;
  reason = '';
  companyName = '';
  industry = '';
  contactName = '';
  contactJobTitle = '';
  contactEmailAddress = '';
  contactPhoneNumber = '';

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private fb: FormBuilder,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {
    this.companyIndustries$ = this.store.select(fromPeerDashboardReducer.getCompanyIndustries);
    this.companyIndustriesLoading$ = this.store.select(fromPeerDashboardReducer.getCompanyIndustriesLoading);
    this.companyIndustriesLoadingError$ = this.store.select(fromPeerDashboardReducer.getCompanyIndustriesLoadingError);
    this.exchangeCompanyRequesting$ = this.store.select(fromPeerDashboardReducer.getPfCompaniesExchangeRequestRequesting);
  }

  get reasonPlaceholder(): string {
    return `Please tell us why you would like this company to be part ` +
      `of the ${this.exchange ? this.exchange.ExchangeName : ''} exchange...`;
  }
  get newCompanyForm(): FormGroup { return this.requestCompanyForm.get('newCompanyForm') as FormGroup; }
  get companyNameControl() { return this.newCompanyForm.get('companyName'); }
  get industryControl() { return this.newCompanyForm.get('industry'); }

  applyNewCompanyForm(): void {
    this.requestCompanyForm.addControl('newCompanyForm', this.fb.group({
      'reason': [this.reason, [PfValidators.required]],
      'companyName': [this.companyName, [PfValidators.required, Validators.minLength(3)], [this.companyNameValidator()]],
      'industry': [this.industry],
      'contactName': [this.contactName, [PfValidators.required]],
      'contactJobTitle': [this.contactJobTitle],
      'contactEmailAddress': [this.contactEmailAddress, [PfValidators.required, Validators.email]],
      'contactPhoneNumber': [this.contactPhoneNumber]
    }));
  }

  // Industry ComboBox Events
  handleIndustryFilterChange(value) {
    this.companyIndustriesFiltered = this.companyIndustries.filter(ci =>
      ci.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

    if (this.companyIndustriesFiltered.length < 1) {
      this.companyIndustriesComboBox.toggle(false);
    }
  }

  handleCompanyIndustryValueChange(value) {
    this.industryControl.setValue(value);
  }

  // Lifecycle Events
  ngOnInit(): void {
    this.applyNewCompanyForm();
    this.store.dispatch(new fromCompanyIndustriesActions.LoadCompanyIndustries);

    this.companyIndustriesSubscription = this.companyIndustries$.subscribe(ci => {
      this.companyIndustries = ci;
      this.companyIndustriesFiltered = this.companyIndustries.slice(0);
    });
  }

  companyNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      const companyName = control.value;
      const exchangeId = this.exchange ? this.exchange.ExchangeId : 0;

      return observableTimer(500).pipe(switchMap(() => {
        return this.exchangeCompanyApiService.validateNewCompanyName(exchangeId, companyName).pipe(
          map(result => {
            return result ? { companyNameExists: result } : null;
          }));
      }));
    };
  }
}
