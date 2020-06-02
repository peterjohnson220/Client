import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AsyncStateObj, GroupedListItem, PayMarketWithMdScope } from 'libs/models';
import { TreeViewMode } from 'libs/ui/common/pf-treeview';
import { MDLocationsRequest } from 'libs/models/payfactors-api';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromMdScopeActions from '../../actions/market-data-scope.actions';
import { Scope } from '../../models';
import { GeneralFormHelper } from '../../helpers';

@Component({
  selector: 'pf-market-data-scope',
  templateUrl: './market-data-scope.component.html',
  styleUrls: ['./market-data-scope.component.scss']
})
export class MarketDataScopeComponent implements OnInit, OnDestroy {
  payMarket$: Observable<AsyncStateObj<PayMarketWithMdScope>>;
  industries$: Observable<AsyncStateObj<GroupedListItem[]>>;
  sizes$: Observable<AsyncStateObj<GroupedListItem[]>>;
  locations$: Observable<AsyncStateObj<GroupedListItem[]>>;

  payMarketSubscription: Subscription;
  sizesSubscription: Subscription;
  industriesSubscription: Subscription;

  countryCode: string;
  treeViewModes = TreeViewMode;
  sizeCheckedKeys: string[] = [];
  industryCheckedKeys: string[] = [];
  locationCheckedKeys: string[] = [];
  sizes: GroupedListItem[];
  industries: GroupedListItem[];
  filteredSizes: GroupedListItem[];
  payMarket: PayMarketWithMdScope;
  defaultLocation: GroupedListItem;
  selectedSize: Scope;
  selectedIndustry: Scope;
  selectedLocation: Scope;

  readonly DEFAULT_ALL = 'All:All';
  readonly DEFAULT_COUNTRY_CODE = 'USA';

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.payMarket$ = this.store.select(fromPayMarketManagementReducer.getPayMarket);
    this.industries$ = this.store.select(fromPayMarketManagementReducer.getAllIndustries);
    this.sizes$ = this.store.select(fromPayMarketManagementReducer.getSizes);
    this.locations$ = this.store.select(fromPayMarketManagementReducer.getLocations);
    this.countryCode = this.DEFAULT_COUNTRY_CODE;
  }

  ngOnInit(): void {
    this.payMarketSubscription = this.payMarket$.subscribe(asyncObj => this.handlePayMarketChanged(asyncObj));
    this.sizesSubscription = this.sizes$.subscribe(results => {
      if (results && !results.loading && !!results.obj && !!results.obj.length) {
        this.sizes = results.obj;
        this.updateSizeControl(this.payMarket.IndustryGroup);
      }
    });
    this.industriesSubscription = this.industries$.subscribe(results => {
      if (results && !results.loading && !!results.obj && !!results.obj.length) {
        this.industries = results.obj;
        this.updateIndustryControl();
      }
    });
  }

  ngOnDestroy(): void {
    this.sizesSubscription.unsubscribe();
    this.industriesSubscription.unsubscribe();
    this.payMarketSubscription.unsubscribe();
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
        this.selectedSize = GeneralFormHelper.buildAllScope('Size');
        this.updateSizeControl(this.selectedIndustry.Group, this.selectedSize);
      }
    }
  }

  handleSelectedLocationChanged(location: string[]): void {
    if (location && location.length) {
      this.selectedLocation = GeneralFormHelper.buildScopeLocation(location[0]);
    }
  }

  handleLocationSearchChanged(searchTerm: string): void {
    if (!searchTerm && searchTerm.length < 2) {
      this.loadLocations();
    } else {
      this.loadLocations(searchTerm);
    }
  }

  handleExpandLocationNode(locationValue: string): void {
    if (!locationValue || !locationValue.length) {
      return;
    }
    const request = GeneralFormHelper.buildLocationRequest(this.countryCode, locationValue);
    this.store.dispatch(new fromMdScopeActions.GetLocations({ request, locationExpandedKey: locationValue }));
  }

  updateLocationsByCountryCode(countryCode: string): void {
    this.countryCode = countryCode;
    this.defaultLocation = GeneralFormHelper.buildAllItem();
    this.locationCheckedKeys = [this.defaultLocation.Value];
    this.loadLocations();
  }

  private handlePayMarketChanged(asyncObj: AsyncStateObj<PayMarketWithMdScope>): void {
    if (!asyncObj || !asyncObj.obj) {
      return;
    }
    this.payMarket = asyncObj.obj;
    this.countryCode = this.payMarket.CountryCode;
    this.refreshSize();
    this.refreshIndustry();
    this.refreshLocation();
  }

  private loadSizes(): void {
    this.store.dispatch(new fromMdScopeActions.GetSizes());
  }

  private loadIndustries(): void {
    this.store.dispatch(new fromMdScopeActions.GetAllIndustries());
  }

  private loadLocations(query?: string): void {
    const request: MDLocationsRequest = {
      CountryCode: this.countryCode && this.countryCode.length ? this.countryCode : this.DEFAULT_COUNTRY_CODE,
      Query: query ? query : ''
    };
    this.store.dispatch(new fromMdScopeActions.GetLocations({ request }));
  }

  private refreshSize(): void {
    if (!this.sizes) {
      this.loadSizes();
    } else {
      this.updateSizeControl(this.payMarket.IndustryGroup);
    }
  }

  private refreshIndustry(): void {
    if (!this.industries) {
      this.loadIndustries();
    } else {
      this.updateIndustryControl();
    }
  }

  private refreshLocation(): void {
    if (!this.payMarket) {
      return;
    }
    this.defaultLocation = GeneralFormHelper.buildDefaultLocation(this.payMarket);
    this.locationCheckedKeys = [this.defaultLocation.Value];
  }

  private updateIndustryControl(): void {
    if (!this.payMarket) {
      return;
    }
    this.selectedIndustry = {
      Label: this.payMarket.IndustryLabel,
      Value: this.payMarket.IndustryValue,
      Group: this.payMarket.IndustryGroup
    };
    this.industryCheckedKeys = !!this.selectedIndustry.Label && !!this.selectedIndustry.Value && this.selectedIndustry.Value !== 'All'
      ? [`${this.selectedIndustry.Label}:${this.selectedIndustry.Group}:${this.selectedIndustry.Value}`]
      : [this.DEFAULT_ALL];
  }

  private updateSizeControl(industryGroup: string, size?: Scope): void {
    if (!this.sizes) {
      return;
    }
    const defaultSize = {
      Label: this.payMarket.SizeLabel ? this.payMarket.SizeLabel : 'All',
      Value: this.payMarket.SizeValue ? this.payMarket.SizeValue : 'All'
    };
    this.selectedSize = size ? size : defaultSize;
    this.filteredSizes = this.sizes.filter(s => s.Level === null || (!!industryGroup && s.Level.indexOf(industryGroup) > -1));
    this.sizeCheckedKeys = !!this.selectedSize.Label && !!this.selectedSize.Value && this.selectedSize.Value !== 'All'
      ? [`${this.selectedSize.Label}:${this.selectedSize.Value}`]
      : [this.DEFAULT_ALL];
  }
}
