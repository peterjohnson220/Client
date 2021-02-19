import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';

import {PricingProjectApiService} from 'libs/data/payfactors-api/project';

import * as fromPricingProjectPageActions from '../actions';
import * as fromPricingProjectPageReducer from '../reducers';



@Injectable()
export class PricingProjectPageEffects {
  constructor(private actions$: Actions,
              private pricingProjectApiService: PricingProjectApiService) {}
}
