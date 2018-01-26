import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { ProductAsset } from 'libs/models/product-assets';

import * as fromProductAssetsActions from '../../actions';
import * as fromProductAssetsReducer from '../../reducers';

@Component({
  selector: 'pf-product-assets-list-component',
  templateUrl: './product-assets-list.component.html',
  styleUrls: ['./product-assets-list.component.scss']
})
export class ProductAssetsListComponent implements OnInit {
  productAssetListLoading$: Observable<boolean>;
  productAssetListLoadingError$: Observable<boolean>;
  // Holds the original list of assets.
  productAssetListItems$: Observable<ProductAsset[]>;
  // Holds the active list of assets to be displayed, includes any search filters.
  activeProductAssetListItems$: Observable<ProductAsset[]>;

  constructor(
    private store: Store<fromProductAssetsReducer.State>
  ) {
    this.productAssetListLoading$ = this.store.select(fromProductAssetsReducer.getProductAssetListLoading);
    this.productAssetListLoadingError$ = this.store.select(fromProductAssetsReducer.getProductAssetListLoadingError);
    this.productAssetListItems$ = this.store.select(fromProductAssetsReducer.getProductAssetListItems);
    this.activeProductAssetListItems$ = this.productAssetListItems$;
  }

  // Events
  handleProductAssetGridReload() {
    this.store.dispatch(new fromProductAssetsActions.LoadingProductAssets());
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromProductAssetsActions.LoadingProductAssets());
  }

  // Search
  updateSearchItems(searchTerm: string) {
    this.activeProductAssetListItems$ = this.productAssetListItems$.map(productAssets => productAssets.filter(productAsset => new RegExp(searchTerm, 'gi').test(productAsset.Title)));
  }
}
