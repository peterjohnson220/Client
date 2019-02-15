import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { PfValidators } from 'libs/forms/validators';

import { MarketDataScope, AddPayMarketFormData, KendoDropDownItem } from '../../models';

@Component({
  selector: 'pf-add-paymarket-form',
  templateUrl: './add-paymarket-form.component.html',
  styleUrls: ['./add-paymarket-form.component.scss']
})
export class AddPayMarketFormComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean;
  @Input() saving: boolean;
  @Input() savingConflict: boolean;
  @Input() savingError: boolean;
  @Input() marketDataScope: MarketDataScope;
  @Input() isInfoBannerOpen = false;
  @Input() showSkipButton = false;
  @Output() saveClick = new EventEmitter<AddPayMarketFormData>();
  @Output() skipClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() dismissInfoBannerClick = new EventEmitter();

  showErrorMessages = false;

  countryList: KendoDropDownItem[] = [{ Name: 'United States', Value: 'USA' }];
  defaultCountry = { Name: 'United States', Value: 'USA' };
  currencyList: KendoDropDownItem[] = [{ Name: 'USD', Value: 'USD' }];
  defaultCurrency = { Name: 'USD', Value: 'USD' };
  defaultIndustry = { Name: 'All', Value: 'All' };
  defaultSize = { Name: 'All', Value: 'All' };
  defaultLocation = 'All';

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

  handleSaveClicked() {
    const data: AddPayMarketFormData = this.buildFormData();
    this.showErrorMessages = true;
    this.saveClick.emit(data);
  }

  handleSkipClicked() {
    this.skipClick.emit();
  }

  handleDismissInfoBanner() {
    this.dismissInfoBannerClick.emit();
  }

  handleIndustryFilter(value: string) {
    this.scopeIndustryData = this.industries.filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleLocationFilter(value: string) {
    this.locations = this.marketDataScope.Locations
      .filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      .slice(0, 5);
  }

  handleCancelClicked() {
    this.cancelClick.emit();
  }

  private buildFormData(): AddPayMarketFormData {
    return {
      Name: this.addPayMarketForm.value.name,
      Country: this.defaultCountry.Value,
      Currency: this.defaultCurrency.Value,
      Location: this.getSelectedLocation(),
      Industry: this.addPayMarketForm.value.industry.Value || this.defaultIndustry.Value,
      Size: this.addPayMarketForm.value.size.Value || this.defaultSize.Value
    };
  }

  private getSelectedLocation(): string {
    const isValidLocation = this.marketDataScope.Locations
      .some(s => s.Value.toLowerCase() === this.addPayMarketForm.value.location.toLowerCase());
    return isValidLocation ? this.addPayMarketForm.value.location : this.defaultLocation;
  }

}
