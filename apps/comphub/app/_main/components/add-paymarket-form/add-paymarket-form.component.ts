import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PfValidators } from 'libs/forms/validators';
import { KendoDropDownItem } from 'libs/models/kendo';

import { MarketDataScope, AddPayMarketFormData, CountryDataSet, MarketDataLocation } from '../../models';

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
  @Input() loadingScopes: boolean;
  @Input() loadingLocations: boolean;
  @Input() countryDataSet: CountryDataSet;
  @Input() locations: MarketDataLocation[] = [];
  @Input() isInfoBannerOpen = false;
  @Input() showSkipButton = false;
  @Output() saveClick = new EventEmitter<AddPayMarketFormData>();
  @Output() skipClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() dismissInfoBannerClick = new EventEmitter();
  @Output() locationFilterChanged = new EventEmitter<string>();

  showErrorMessages = false;

  defaultIndustry = { Name: 'All', Value: 'All' };
  defaultSize = { Name: 'All', Value: 'All' };
  defaultLocation: MarketDataLocation = {
    GeoLabel: 'Location',
    LocationName: 'All',
    GeoLabelDisplayName: 'Location'
  };

  addPayMarketForm: FormGroup;
  scopeIndustryData: KendoDropDownItem[];
  industries: KendoDropDownItem[];
  sizes: KendoDropDownItem[];

  selectedLocation: MarketDataLocation;

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
    this.locationFilterChanged.emit(value);
  }

  handleCancelClicked() {
    this.cancelClick.emit();
  }

  setSelectedLocation(location: MarketDataLocation) {
    this.selectedLocation = location;
  }

  private buildFormData(): AddPayMarketFormData {
    const location = this.getSelectedLocation();
    return {
      Name: this.addPayMarketForm.value.name,
      Country: this.countryDataSet.CountryCode,
      Currency: this.countryDataSet.CurrencyCode,
      Location: location.LocationName,
      Industry: this.addPayMarketForm.value.industry.Value || this.defaultIndustry.Value,
      Size: this.addPayMarketForm.value.size.Value || this.defaultSize.Value,
      GeoLabel: location.GeoLabel
    };
  }

  private getSelectedLocation(): MarketDataLocation {
    if (!!this.selectedLocation &&
      this.addPayMarketForm.value.location.toLowerCase() === this.selectedLocation.LocationName.toLowerCase()) {
      return this.selectedLocation;
    }
    // if no selected location or it doesn't match, grab the 1st one that matches
    const firstMatchingLocation = this.locations
      .find(s => s.LocationName !== null && s.LocationName.toLowerCase() === this.addPayMarketForm.value.location.toLowerCase());
    // fall back to default location if none of those match
    return !!firstMatchingLocation ? firstMatchingLocation : this.defaultLocation;
  }

}
