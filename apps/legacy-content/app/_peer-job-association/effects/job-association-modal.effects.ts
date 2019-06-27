import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

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
    map((action: fromJamActions.Initialize) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  @Effect({ dispatch: false })
  updateSaveableChanges$ = this.actions$.pipe(
    ofType(fromJamActions.CHANGE_SAVEABLE_ENTITIES),
    tap((action: fromJamActions.ChangeSaveableEntities) => this.windowCommunicationService.postMessage(action.type, action.payload))
  );

  constructor(private actions$: Actions,
              private windowCommunicationService: WindowCommunicationService) { }
}
