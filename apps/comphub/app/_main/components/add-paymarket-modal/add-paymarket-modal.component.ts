import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';

import { PfValidators } from 'libs/forms/validators';

import { AddPayMarketModalData } from '../../models/add-paymarket-modal-data';
import { KendoDropDownItem } from '../../models/kendo-dropdown-item.model';
import { MarketDataScope } from '../../models';

@Component({
  selector: 'pf-add-paymarket-modal',
  templateUrl: './add-paymarket-modal.component.html',
  styleUrls: ['./add-paymarket-modal.component.scss']
})
export class AddPayMarketModalComponent implements OnInit, OnChanges {
  @Input() saving: boolean;
  @Input() savingConflict: boolean;
  @Input() savingError: boolean;
  @Input() marketDataScope: MarketDataScope;
  @Output() saveClick = new EventEmitter<AddPayMarketModalData>();
  @Output() skipClick = new EventEmitter();

  @ViewChild('locationAutoComplete')
  private locationAutoComplete: AutoCompleteComponent;

  showErrorMessages = false;

  countryList: KendoDropDownItem[] = [{ Name: 'United States', Value: 'USA' }];
  defaultCountry = { Name: 'United States', Value: 'USA' };
  currencyList: KendoDropDownItem[] = [{ Name: 'USD', Value: 'USD' }];
  defaultCurrency = { Name: 'USD', Value: 'USD' };

  addPayMarketForm: FormGroup;
  scopeIndustryData: KendoDropDownItem[];
  locations: KendoDropDownItem[];
  industries: KendoDropDownItem[];
  sizes: KendoDropDownItem[];

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.marketDataScope && !!changes.marketDataScope.currentValue) {
      this.industries = this.marketDataScope.Industries;
      this.scopeIndustryData = this.industries.slice();
      this.sizes = this.marketDataScope.Sizes;
    }
  }

  get submitDisabled(): boolean {
    if (!this.addPayMarketForm) {
      return this.saving;
    }

    return this.saving || !this.addPayMarketForm.valid || !(this.addPayMarketForm.dirty || this.addPayMarketForm.touched);
  }

  createForm() {
    this.addPayMarketForm = this.fb.group({
      'name': ['', [PfValidators.required, Validators.maxLength(255)]],
      'country': new FormControl({value: this.defaultCountry, disabled: true}),
      'currency': new FormControl({value: this.defaultCurrency, disabled: true}),
      'location': [''],
      'industry': [{}],
      'size': [{}]
    });
  }

  submit() {
    const modalData: AddPayMarketModalData = this.buildModalData();
    this.showErrorMessages = true;
    this.saveClick.emit(modalData);
  }

  dismiss() {
    this.skipClick.emit();
  }

  handleIndustryFilter(value: string) {
    this.scopeIndustryData = this.industries.filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleLocationFilter(value: string) {
    this.locations = this.marketDataScope.Locations
      .filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      .slice(0, 5);
  }

  private buildModalData(): AddPayMarketModalData {
    return {
      Name: this.addPayMarketForm.value.name,
      Country: this.defaultCountry.Value,
      Currency: this.defaultCurrency.Value,
      Location: this.addPayMarketForm.value.location,
      Industry: this.addPayMarketForm.value.industry.Value,
      Size: this.addPayMarketForm.value.size.Value
    };
  }

}
