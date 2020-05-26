import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings, ComboBoxComponent, DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { AsyncStateObj } from 'libs/models/state';
import { PfValidators } from 'libs/forms/validators';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { PayMarket, GroupedListItem, DefaultUserPayMarket } from 'libs/models';
import { TreeViewMode, PfTreeViewComponent } from 'libs/ui/common';
import { MDLocationsRequest } from 'libs/models/payfactors-api/paymarket/request';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromGeneralFormActions from '../../actions/general-form.actions';
import { Scope } from '../../models';
import { GeneralFormHelper } from '../../helpers';

@Component({
  selector: 'pf-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() reset: boolean;

  @ViewChild('linkedPayMarketCombobox', { static: true }) public linkedPayMarketCombobox: ComboBoxComponent;
  @ViewChild('countryComponent', { static: true }) public countryComponent: DropDownListComponent;
  @ViewChild('currencyComponent', { static: true }) public currencyComponent: DropDownListComponent;
  @ViewChild('sizeComponent', { static: true }) public sizeComponent: PfTreeViewComponent;
  @ViewChild('industryComponent', { static: true }) public industryComponent: PfTreeViewComponent;

  countries$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  currencies$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  linkedPayMarkets$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  sizes$: Observable<AsyncStateObj<GroupedListItem[]>>;
  defaultPayMarket$: Observable<AsyncStateObj<DefaultUserPayMarket>>;
  industries$: Observable<AsyncStateObj<GroupedListItem[]>>;
  locations$: Observable<AsyncStateObj<GroupedListItem[]>>;

  countriesSubscription: Subscription;
  currenciesSubscription: Subscription;
  defaultPayMarketSubscription: Subscription;
  sizesSubscription: Subscription;
  industriesSubscription: Subscription;

  payMarketForm: FormGroup;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  payMarket: PayMarket;
  countries: KendoTypedDropDownItem[];
  currencies: KendoTypedDropDownItem[];
  sizes: GroupedListItem[];
  industries: GroupedListItem[];
  filteredSizes: GroupedListItem[];
  hasLinkedPayMarket: boolean;
  defaultPayMarket: DefaultUserPayMarket;
  treeViewModes = TreeViewMode;
  sizeCheckedKeys: string[] = [];
  industryCheckedKeys = ['All'];
  selectedSize: Scope;
  selectedIndustry: Scope;
  defaultScopeSize: Scope;
  defaultScopeIndustry: Scope;
  locationCheckedKeys: string[] = [];
  selectedLocation: GroupedListItem;
  selectedScopeLocation: Scope;

  readonly DEFAULT_MAX_LENGTH = 255;
  readonly DEFAULT_COUNTRY = 'USA';
  readonly DEFAULT_CURRENCY = 'USD';
  readonly DEFAULT_ALL = 'All:All';

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.countries$ = this.store.select(fromPayMarketManagementReducer.getCountries);
    this.currencies$ = this.store.select(fromPayMarketManagementReducer.getCurrencies);
    this.linkedPayMarkets$ = this.store.select(fromPayMarketManagementReducer.getLinkedPayMarkets);
    this.sizes$ = this.store.select(fromPayMarketManagementReducer.getSizes);
    this.defaultPayMarket$ = this.store.select(fromPayMarketManagementReducer.getDefaultPayMarket);
    this.industries$ = this.store.select(fromPayMarketManagementReducer.getAllIndustries);
    this.locations$ = this.store.select(fromPayMarketManagementReducer.getLocations);
  }

  get f() { return this.payMarketForm.controls; }

  get isNotValid(): boolean {
    return !this.payMarketForm.valid || !(this.payMarketForm.dirty || this.payMarketForm.touched);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.reset && changes.reset.currentValue) {
      this.resetForm();
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.initSubscriptions();
    this.store.dispatch(new fromGeneralFormActions.GetCountries());
    this.store.dispatch(new fromGeneralFormActions.GetCurrencies());
    this.loadDefaultPayMarket();
    this.loadLinkedPayMarkets();
    this.loadLocations();
  }

  ngOnDestroy(): void {
    this.countriesSubscription.unsubscribe();
    this.currenciesSubscription.unsubscribe();
    this.defaultPayMarketSubscription.unsubscribe();
    this.sizesSubscription.unsubscribe();
    this.industriesSubscription.unsubscribe();
  }

  refresh(): void {
    this.loadDefaultPayMarket();
  }

  handleCountryChange(countryCode: string): void {
    const country = this.countries.find(c => c.Value === countryCode);
    if (country) {
      const parsedCountryCurrency: string[] = country.Name.split('-');
      if (parsedCountryCurrency && parsedCountryCurrency.length === 2) {
        this.updateCurrencyCode(parsedCountryCurrency[1].trim());
        this.selectedLocation = GeneralFormHelper.buildAllItem();
        this.locationCheckedKeys = [this.selectedLocation.Value];
        this.loadLocations();
      }
    }
  }

  handleLinkedPayMarketChange(payMarketId: number): void {
    this.hasLinkedPayMarket = !!payMarketId;
    if (!payMarketId) {
      this.payMarketForm.controls['ShowInLinkedStructure'].setValue(false);
    }
  }

  handleSelectedSizesChanged(sizes: string[]): void {
    if (sizes && sizes.length) {
      const parsedSize: string[] = sizes[0].split(':');
      if (parsedSize.length === 2) {
        this.selectedSize = {
          Label: parsedSize[0],
          Value: parsedSize[1]
        };
      }
    }
  }

  handleSelectedIndustryChanged(industry: string[]): void {
    if (industry && industry.length) {
      const parsedIndustry: string[] = industry[0].split(':');
      if (parsedIndustry.length === 3) {
        this.selectedIndustry = {
          Label: parsedIndustry[0],
          Group: parsedIndustry[1],
          Value: parsedIndustry[2]
        };
      }
      this.updateSizeControl(this.selectedIndustry.Group, this.selectedSize);
    }
  }

  handleSelectedLocationChanged(location: string[]): void {
    if (location && location.length) {
      this.selectedScopeLocation = GeneralFormHelper.buildScopeLocation(location[0]);
    }
  }

  handleExpandLocationNode(locationValue: string): void {
    const countryControl = this.payMarketForm.controls['CountryCode'];
    const countryCode = countryControl ? countryControl.value : this.DEFAULT_COUNTRY;
    if (!locationValue || !locationValue.length) {
      return;
    }
    const request = GeneralFormHelper.buildLocationRequest(countryCode, locationValue);
    this.store.dispatch(new fromGeneralFormActions.GetLocations({ request, locationExpandedKey: locationValue }));
  }

  private initSubscriptions(): void {
    this.defaultPayMarketSubscription = this.defaultPayMarket$.subscribe(asyncObj => this.handleDefaultPayMarketChanged(asyncObj));
    this.countriesSubscription = this.countries$.subscribe(results => {
      if (results && !!results.obj) {
        this.countries = results.obj;
        this.updateCountryControl();
      }
    });
    this.currenciesSubscription = this.currencies$.subscribe(results => {
      if (results && !!results.obj) {
        this.currencies = results.obj;
        this.updateCurrencyCode(this.DEFAULT_CURRENCY);
      }
    });
    this.sizesSubscription = this.sizes$.subscribe(results => {
      if (results && !!results.obj && !!results.obj.length) {
        this.sizes = results.obj;
        this.updateSizeControl(this.defaultPayMarket.IndustryValue, this.defaultScopeSize);
      }
    });
    this.industriesSubscription = this.industries$.subscribe(results => {
      if (results && !!results.obj && !!results.obj.length) {
        this.industries = results.obj;
        this.updateIndustryControl(this.defaultScopeIndustry);
      }
    });
  }

  handleLocationSearchChanged(searchTerm: string): void {
    if (!searchTerm && searchTerm.length < 2) {
      this.loadLocations();
    } else {
      this.loadLocations(searchTerm);
    }
  }

  private createForm(): void {
    this.payMarketForm = this.formBuilder.group({
      PayMarketName: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      LinkedPayMarket: null,
      LinkedPayMarketAdj: null,
      CountryCode: [null, PfValidators.required],
      CurrencyCode: [null, PfValidators.required],
      ShowInLinkedStructure: false
    });
  }

  private resetForm(): void {
    if (!this.payMarketForm) {
      return;
    }
    this.payMarketForm.reset({
      PayMarketName: '',
      LinkedPayMarket: '',
      LinkedPayMarketAdj: null,
      CountryCode: this.DEFAULT_COUNTRY,
      CurrencyCode: this.DEFAULT_CURRENCY,
      ShowInLinkedStructure: false
    });
    this.linkedPayMarketCombobox.filterChange.emit('');
    this.countryComponent.filterChange.emit('');
    this.currencyComponent.filterChange.emit('');
    this.updateSizeControl(this.defaultPayMarket.IndustryValue, this.defaultScopeSize);
    this.hasLinkedPayMarket = false;
  }

  private handleDefaultPayMarketChanged(asyncObj: AsyncStateObj<DefaultUserPayMarket>): void {
    if (asyncObj && !!asyncObj.obj) {
      this.defaultPayMarket = asyncObj.obj;
      this.defaultScopeSize = {
        Label: this.defaultPayMarket.SizeLabel ? this.defaultPayMarket.SizeLabel : 'All',
        Value: this.defaultPayMarket.SizeValue ? this.defaultPayMarket.SizeValue : 'All'
      };
      this.defaultScopeIndustry = {
        Label: this.defaultPayMarket.IndustryLabel ? this.defaultPayMarket.IndustryLabel : 'All',
        Value: this.defaultPayMarket.IndustryValue ? this.defaultPayMarket.IndustryValue : 'All'
      };
      if (!this.sizes) {
        this.loadSizes();
      } else {
        this.updateSizeControl(this.defaultPayMarket.IndustryValue, this.defaultScopeSize);
      }
      if (!this.industries) {
        this.loadIndustries();
      } else {
        this.updateIndustryControl(this.defaultScopeIndustry);
      }
      this.selectedLocation = GeneralFormHelper.buildDefaultLocation(this.defaultPayMarket);
      this.locationCheckedKeys = [this.selectedLocation.Value];
    }
  }

  private updateCountryControl(): void {
    const countryControl = this.payMarketForm.controls['CountryCode'];
    let selectedValue = this.DEFAULT_COUNTRY;
    if (!!this.payMarket && this.payMarket.CountryCode) {
      selectedValue = this.payMarket.CountryCode;
    }
    countryControl.setValue(selectedValue);
  }

  private updateCurrencyCode(currencyCode: string): void {
    const currenciesControl = this.payMarketForm.controls['CurrencyCode'];
    let selectedValue = this.currencies.find(c => c.Value === currencyCode)
      ? currencyCode
      : this.DEFAULT_CURRENCY;
    if (!!this.payMarket && this.payMarket.CurrencyCode) {
      selectedValue = this.payMarket.CurrencyCode;
    }
    currenciesControl.setValue(selectedValue);
  }

  private loadDefaultPayMarket(): void {
    this.store.dispatch(new fromGeneralFormActions.GetDefaultUserPayMarket());
  }

  private loadLinkedPayMarkets(): void {
    const payMarketId = this.payMarket ? this.payMarket.CompanyPayMarketId : 0;
    this.store.dispatch(new fromGeneralFormActions.GetLinkedPayMarkets({ payMarketId }));
  }

  private loadSizes(): void {
    this.store.dispatch(new fromGeneralFormActions.GetSizes());
  }

  private loadIndustries(): void {
    this.store.dispatch(new fromGeneralFormActions.GetAllIndustries());
  }

  private updateSizeControl(industryGroup: string, size: Scope): void {
    if (!size) {
      return;
    }
    this.filteredSizes = this.sizes.filter(s => s.Level === null || (!!industryGroup && s.Level.indexOf(industryGroup) > -1));
    this.sizeCheckedKeys = !!size.Label && !!size.Value && size.Value !== 'All'
      ? [`${size.Label}:${size.Value}`]
      : [this.DEFAULT_ALL];
    this.changeDetectorRef.detectChanges();
  }

  private updateIndustryControl(industry: Scope): void {
    if (!industry) {
      return;
    }
    this.industryCheckedKeys = [`${industry.Label}:${industry.Value}`];
    this.changeDetectorRef.detectChanges();
  }

  private loadLocations(query?: string): void {
    const countryControl = this.payMarketForm.controls['CountryCode'];
    const countryCode = countryControl ? countryControl.value : this.DEFAULT_COUNTRY;
    const request: MDLocationsRequest = {
      CountryCode: countryCode,
      Query: query ? query : ''
    };
    this.store.dispatch(new fromGeneralFormActions.GetLocations({ request }));
  }
}
