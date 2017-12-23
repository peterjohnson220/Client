import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductAsset } from 'libs/models/product-assets';

import * as fromProductAssetsActions from '../actions';
import * as fromProductAssetsReducer from '../reducers';

@Component({
  selector: 'pf-product-assets-list-component',
  templateUrl: './product-assets-list.component.html',
  styleUrls: ['./product-assets-list.component.scss']
})
export class ProductAssetsListComponent implements OnInit {
  productAssetListLoading$: Observable<boolean>;
  productAssetListLoadingError$: Observable<boolean>;
  productAssetListItems$: Observable<ProductAsset[]>;

  constructor(
    private store: Store<fromProductAssetsReducer.State>// ,
    // private router: Router
  ) {
    this.productAssetListLoading$ = this.store.select(fromProductAssetsReducer.getProductAssetListLoading);
    this.productAssetListLoadingError$ = this.store.select(fromProductAssetsReducer.getProductAssetListLoadingError);
    this.productAssetListItems$ = this.store.select(fromProductAssetsReducer.getProductAssetListItems);
  }

  // Events
  handleProductAssetGridReload() {
    this.store.dispatch(new fromProductAssetsActions.LoadingProductAssets());
  }

  handleClick(productAsset: ProductAsset) {
    // this.router.navigate([ '/product-assets', cellClickEvent.dataItem.AssetId ]);
    alert(productAsset.Title + ' clicked');
  }
  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromProductAssetsActions.LoadingProductAssets());
  }
}
