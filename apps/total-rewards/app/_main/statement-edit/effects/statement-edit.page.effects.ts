import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';


import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class StatementEditPageEffects {

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions) {}
}
