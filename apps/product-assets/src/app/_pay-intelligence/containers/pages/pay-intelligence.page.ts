import { Component, OnInit } from '@angular/core';
import { InputDebounceComponent } from 'libs/forms/components';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromProductAssetsReducer from '../../reducers';
import * as fromProductAssetsActions from '../../actions';

@Component({
  selector: 'pf-pay-intelligence-page',
  templateUrl: './pay-intelligence.page.html',
  styleUrls: ['./pay-intelligence.page.scss']
})
export class PayIntelligencePageComponent implements OnInit{
  showWhatsNewLink: boolean;
  showLoadAllLink: boolean;
  whatsNewEnabled$: Observable<boolean>;
  searchTerm: string;

  constructor(
    private store: Store<fromProductAssetsReducer.State>
  ) {
    this.showWhatsNewLink = false;
    this.showLoadAllLink = false;
    this.whatsNewEnabled$ = this.store.select(fromProductAssetsReducer.getProductAssetListWhatsNewEnabled);
  }

  ngOnInit() {
    this.whatsNewEnabled$.subscribe(e => {
      if (e) {
        this.showWhatsNewLink = true;
      }
    })
  }

  // Triggers an action to filter on the original list of assets
  updateSearchTerm(newSearchTerm: string) {
    this.store.dispatch(new fromProductAssetsActions.FilterProductAssets(newSearchTerm));
    if (this.showWhatsNewLink || this.showLoadAllLink) {
      this.showWhatsNewLink = true;
      this.showLoadAllLink = false;
    }
  }

  // Triggers an action to show only the "New" items on the page.
  // Items are considered new if they have been created in the last 90 days.
  showNewItems() {
    this.store.dispatch(new fromProductAssetsActions.ShowNewAssets());
    this.showWhatsNewLink = false;
    this.showLoadAllLink = true;
    this.searchTerm = '';
  }

  // Triggers an action to show all items on the page.
  showAllItems() {
    this.store.dispatch(new fromProductAssetsActions.LoadAllAssets());
    this.showLoadAllLink = false;
    this.showWhatsNewLink = true;
    this.searchTerm = '';
  }
}
