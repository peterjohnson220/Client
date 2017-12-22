import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import { ProductAssetsApiService } from 'libs/data/payfactors-api';
import { ProductAsset } from 'libs/models/product-assets';

import * as fromProductAssetsListActions from '../actions/product-assets-list.actions';

@Injectable()
export class ProductAssetsListEffects {

  @Effect()
  loadProductAssets$: Observable<Action> = this.actions$
    .ofType(fromProductAssetsListActions.LOADING_PRODUCT_ASSETS)
    .switchMap(() =>
      this.productAssetsApiService.getProductAssets()
        .map((productAssetListItems: ProductAsset[]) => new fromProductAssetsListActions.LoadingProductAssetsSuccess(productAssetListItems))
        .catch(error => of(new fromProductAssetsListActions.LoadingProductAssetsError()))
    );

  constructor(
    private actions$: Actions,
    private productAssetsApiService: ProductAssetsApiService
  ) {}
}


