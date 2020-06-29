import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {forkJoin, Observable, of} from 'rxjs/index';
import * as fromPricingMatchActions from '../actions/pricing-match.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ExchangeDataCutsApiService} from '../../../data/payfactors-api/peer/exchange-data-cuts-api.service';
import {PricingMatchApiService} from '../../../data/payfactors-api/pricing';
import {CompanyJobApiService} from '../../../data/payfactors-api/company';


@Injectable()
export class PricingMatchEffects {
  constructor(
    private actions$: Actions,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private pricingMatchService: PricingMatchApiService,
    private companyJobApiService: CompanyJobApiService) {
  }

  @Effect()
  loadPeerMatch$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingMatchActions.LOAD_PEER_MATCH),
      switchMap(
        (action: fromPricingMatchActions.LoadPeerMatch) =>
          this.exchangeDataCutsApiService.getDataCutFilter(action.filterGUID).pipe(
            map((peerMatch: any) => {
              return new fromPricingMatchActions.LoadPricingMatchSuccess(peerMatch);
            }),
            catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
          )
      )
    );
  @Effect()
  loadSurveyMatch$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingMatchActions.LOAD_SURVEY_MATCH),
      switchMap(
        (action: fromPricingMatchActions.LoadSurveyMatch) =>
          this.pricingMatchService.getSurveyPricingMatch(action.surveyDataId).pipe(
            map((surveyMatch: any) => new fromPricingMatchActions.LoadPricingMatchSuccess(surveyMatch)),
            catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
          )
      )
    );
  @Effect()
  loadMDJobMatch$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingMatchActions.LOAD_MDJOB_MATCH),
      switchMap(
        (action: fromPricingMatchActions.LoadMdJobMatch) =>
          this.pricingMatchService.getMDJobPricingMatch(action.mdJobCode, action.pricingId).pipe(
            map((mdJobMatch: any) => new fromPricingMatchActions.LoadPricingMatchSuccess(mdJobMatch)),
            catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
          )
      )
    );
  @Effect()
  loadSlottedCompanyJobMatch$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingMatchActions.LOAD_SLOTTED_COMPANY_JOB_MATCH),
      switchMap(
        (action: fromPricingMatchActions.LoadSlottedCompanyJobMatch) =>
          forkJoin(this.pricingMatchService.getSlottedCompanyJobPricingMatch(action.companyJobId),
            this.companyJobApiService.getJobUserDefinedFields()).pipe(
            map((data) => {
              const job = this.replaceUdfs(data[0], data[1]);
              return new fromPricingMatchActions.LoadPricingMatchSuccess(job);
            }),
            catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
          )
      )
    );

  replaceUdfs(companyJob, fieldMapping) {
    companyJob.CustomFields = [];
    fieldMapping.forEach(f => {
      companyJob.CustomFields.push({
        DisplayName: f.DispName,
        Value: companyJob[f.ColumnName]
      });
      delete companyJob[f.ColumnName];
    });
    return companyJob;
  }
}
