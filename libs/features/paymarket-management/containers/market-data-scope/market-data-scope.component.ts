import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AsyncStateObj, GroupedListItem, DefaultUserPayMarket } from 'libs/models';
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
  defaultPayMarket$: Observable<AsyncStateObj<DefaultUserPayMarket>>;
  industries$: Observable<AsyncStateObj<GroupedListItem[]>>;
  sizes$: Observable<AsyncStateObj<GroupedListItem[]>>;
  locations$: Observable<AsyncStateObj<GroupedListItem[]>>;

  defaultPayMarketSubscription: Subscription;
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
  defaultPayMarket: DefaultUserPayMarket;
  defaultLocation: GroupedListItem;
  selectedSize: Scope;
  selectedIndustry: Scope;
  selectedLocation: Scope;

  readonly DEFAULT_ALL = 'All:All';
  readonly DEFAULT_COUNTRY_CODE = 'USA';

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.defaultPayMarket$ = this.store.select(fromPayMarketManagementReducer.getDefaultPayMarket);
    this.industries$ = this.store.select(fromPayMarketManagementReducer.getAllIndustries);
    this.sizes$ = this.store.select(fromPayMarketManagementReducer.getSizes);
    this.locations$ = this.store.select(fromPayMarketManagementReducer.getLocations);
    this.countryCode = this.DEFAULT_COUNTRY_CODE;
  }

  ngOnInit(): void {
    this.defaultPayMarketSubscription = this.defaultPayMarket$.subscribe(asyncObj => this.handleDefaultPayMarketChanged(asyncObj));
    this.sizesSubscription = this.sizes$.subscribe(results => {
      if (results && !results.loading && !!results.obj && !!results.obj.length) {
        this.sizes = results.obj;
        this.updateSizeControl(this.defaultPayMarket.IndustryGroup);
      }
    });
    this.industriesSubscription = this.industries$.subscribe(results => {
      if (results && !results.loading && !!results.obj && !!results.obj.length) {
        this.industries = results.obj;
      }
    });
  }

  ngOnDestroy(): void {
    this.sizesSubscription.unsubscribe();
    this.industriesSubscription.unsubscribe();
    this.defaultPayMarketSubscription.unsubscribe();
  }

  handleDefaultPayMarketChanged(asyncObj: AsyncStateObj<DefaultUserPayMarket>): void {
    if (!asyncObj || !asyncObj.obj) {
      return;
    }
    this.defaultPayMarket = asyncObj.obj;
    this.countryCode = this.defaultPayMarket.CountryCode;
    this.refreshSize();
    this.refreshIndustry();
    this.refreshLocation();
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
      this.updateSizeControl(this.defaultPayMarket.IndustryGroup);
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
    this.defaultLocation = GeneralFormHelper.buildDefaultLocation(this.defaultPayMarket);
    this.locationCheckedKeys = [this.defaultLocation.Value];
  }

  private updateIndustryControl(): void {
    if (!this.defaultPayMarket) {
      return;
    }
    this.selectedIndustry = {
      Label: this.defaultPayMarket.IndustryLabel,
      Value: this.defaultPayMarket.IndustryValue,
      Group: this.defaultPayMarket.IndustryGroup
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
      Label: this.defaultPayMarket.SizeLabel ? this.defaultPayMarket.SizeLabel : 'All',
      Value: this.defaultPayMarket.SizeValue ? this.defaultPayMarket.SizeValue : 'All'
    };
    this.selectedSize = size ? size : defaultSize;
    this.filteredSizes = this.sizes.filter(s => s.Level === null || (!!industryGroup && s.Level.indexOf(industryGroup) > -1));
    this.sizeCheckedKeys = !!this.selectedSize.Label && !!this.selectedSize.Value && this.selectedSize.Value !== 'All'
      ? [`${this.selectedSize.Label}:${this.selectedSize.Value}`]
      : [this.DEFAULT_ALL];
  }
}
