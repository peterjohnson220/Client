import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import * as fromJobAssociationReducer from 'libs/features/peer/job-association/reducers';
import * as fromJamActions from 'libs/features/peer/job-association/actions/job-association-modal.actions';

import { WindowCommunicationService } from 'libs/core/services';

@Injectable()
export class JobAssociationModalEffects {
  // Window communication effects
  @Effect({ dispatch: false })
  openJobAssociationModal$ = this.actions$.pipe(
    ofType(fromJamActions.CLOSE_JOB_ASSOCIATIONS_MODAL, fromJamActions.SAVE_JOB_ASSOCIATIONS_SUCCESS),
    map(() => new fromJamActions.CloseJobAssociationsModal()),
    tap((action: fromJamActions.CloseJobAssociationsModal) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  @Effect({ dispatch: false })
  jobAssociationModalInitialized$ = this.actions$.pipe(
    ofType(fromJamActions.INITIALIZE),
    map((action) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  constructor(private actions$: Actions,
              private store: Store<fromJobAssociationReducer.State>,
              private windowCommunicationService: WindowCommunicationService) { }
}
