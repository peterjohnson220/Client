import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap, concatMap } from 'rxjs/operators';

import { TagApiService } from 'libs/data/payfactors-api/tags';
import { TagInformation } from 'libs/models/peer';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromTaggingEntitiesActions from '../actions/tagging-entities.actions';
import * as fromPeerAdminReducer from '../reducers';

@Injectable()
export class TaggingEntitiesEffects {
  @Effect()
  loadTagInformation$: Observable<Action> = this.actions$.pipe(
    ofType(fromTaggingEntitiesActions.LOAD_TAG_INFORMATION),
    map((action: fromTaggingEntitiesActions.LoadTagInformation) => action),
    switchMap((action) => {
        this.windowCommunicationService.postMessage(action.type);
        return this.tagApiService.getTagInformation(action.payload).pipe(
          map((tagInformationResult: TagInformation[]) => {
            return new fromTaggingEntitiesActions.LoadTagInformationSuccess(tagInformationResult);
          }),
          catchError(error => of(new fromTaggingEntitiesActions.LoadTagInformationError()))
        );
      }
    )
  );

  @Effect()
  saveTagInformation$: Observable<Action> = this.actions$.pipe(
    ofType(fromTaggingEntitiesActions.SAVE_TAG_INFORMATION),
      map((action: fromTaggingEntitiesActions.SaveTagInformation) => action.payload),
      switchMap(payload => {
        return this.tagApiService.saveTagInformation(payload).pipe(
          concatMap(() => {
            return [
              new fromTaggingEntitiesActions.SaveTagInformationSuccess(),
              new fromTaggingEntitiesActions.CloseTaggingEntitiesModal()
            ];
          }),
          catchError(error => of(new fromTaggingEntitiesActions.SaveTagInformationError()))
        );
      }
    )
  );

  @Effect({ dispatch: false })
  closeTaggingEntitiesModal$ = this.actions$.pipe(
    ofType(fromTaggingEntitiesActions.CLOSE_TAGGING_ENTITIES_MODAL),
    tap((action: fromTaggingEntitiesActions.CloseTaggingEntitiesModal) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  constructor(
    private actions$: Actions,
    private tagApiService: TagApiService,
    private peerAdminStore: Store<fromPeerAdminReducer.State>,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
