import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { TempExchangeDataCutDetails } from 'libs/models/payfactors-api';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';

import { TempDataCutIdentity } from '../models';
import * as fromTempDataCutActions from '../actions/temp-data-cut.actions';
import * as fromMultiMatchReducer from '../reducers';




@Injectable()
export class TempDataCutService {

  creating$: Observable<boolean>;
  editing$: Observable<boolean>;
  upserting$: Observable<boolean>;
  tempDataCutIdentity$: Observable<TempDataCutIdentity>;
  state$: Observable<{editing: boolean, creating: boolean, identity: TempDataCutIdentity}>;

  get creatingExchangeJobId(): number {
    let exchangeJobId = null;
    combineLatest([this.creating$, this.tempDataCutIdentity$]).pipe(take(1)).subscribe((combined) => {
      if (!!combined[0]) {
        exchangeJobId = combined[1].ExchangeJobId;
      }
    });
    return exchangeJobId;
  }

  create(exchangeJobId: number): void {
    this.store.dispatch(new fromTempDataCutActions.CreateTempDataCut({exchangeJobId}));
  }

  edit(jobCutData: any): void {
    const cut = jobCutData.jobCut;

    const tempDataCutIdentity: TempDataCutIdentity = {
      ExchangeJobId: cut.DataSourceJobId,
      MatchType: cut.MatchType,
      MatchId: cut.MatchId,
      JobId: jobCutData.job.CompanyJobId
    };

    this.store.dispatch(new fromTempDataCutActions.EditTempDataCut(tempDataCutIdentity));
  }

  complete(tempExchangeDataCutDetails: TempExchangeDataCutDetails): void {
    const dataCut = tempExchangeDataCutDetails.TempExchangeJobDataCut;
    this.store.dispatch(new fromDataCutValidationActions.AddTempDataCutValidation(dataCut.DataCutValidationInfo));
    this.state$.pipe(take(1)).subscribe((state) => {
      if (state.editing) {
        this.store.dispatch(new fromTempDataCutActions.EditTempDataCutComplete({
          tempDataCutId: dataCut.TempExchangeJobDataCutId,
          exchangeDataSearchRequest: tempExchangeDataCutDetails.ExchangeDataSearchRequest
        }));
        return;
      }

      if (state.creating) {
        this.store.dispatch(new fromTempDataCutActions.CreateTempDataCutComplete({
          tempDataCutId: dataCut.TempExchangeJobDataCutId,
          exchangeDataSearchRequest: tempExchangeDataCutDetails.ExchangeDataSearchRequest
        }));
      }
    });
  }

  cancel(): void {
    this.store.dispatch(new fromTempDataCutActions.EditTempDataCutComplete(null));
  }

  reset(): void {
    this.store.dispatch(new fromTempDataCutActions.ResetTempDataCutService());
    this.store.dispatch(new fromDataCutValidationActions.ClearTempDataCutValidation());
  }

  constructor(private store: Store<fromMultiMatchReducer.State>) {
    this.editing$ = this.store.select(fromMultiMatchReducer.getTempDataCutEditing);
    this.creating$ = this.store.select(fromMultiMatchReducer.getTempDataCutCreating);
    this.tempDataCutIdentity$ = this.store.select(fromMultiMatchReducer.getTempDataCutCurrentIdentity);
    this.state$ = combineLatest([this.creating$, this.editing$, this.tempDataCutIdentity$]).pipe(map((combined) => {
      return {
        creating: !!combined[0],
        editing: !!combined[1],
        identity: combined[2]
      };
    }));
    this.upserting$ = this.store.select(fromMultiMatchReducer.getTempDataCutUpsert);
  }
}
