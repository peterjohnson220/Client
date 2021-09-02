import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { filter } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';
import { Action } from '@ngrx/store';

import * as fromComphubPageActions from '../actions/comphub-page.actions';

export interface IComphubPageEffectsConfiguration {
  comphubPageEffectsActionOverrides: fromComphubPageActions.Actions[];
}


export const COMPHUB_PAGE_EFFECTS_CONFIGURATION = new InjectionToken<IComphubPageEffectsConfiguration>('');

@Injectable()
export class ComphubPageEffectsService {
  comphubPageEffectsActionOverrides: fromComphubPageActions.Actions[] = [];

  actionOverrideFilter(): OperatorFunction<Action, Action> {
    const overrideTypes = this.comphubPageEffectsActionOverrides.map(action => action.type);
    return filter((action: fromComphubPageActions.Actions) => {
      return overrideTypes.indexOf(action.type) < 0;
    });
  }

  constructor(
    @Optional()
    @Inject(COMPHUB_PAGE_EFFECTS_CONFIGURATION)
    comphubPageEffectsConfiguration: IComphubPageEffectsConfiguration) {
    if (!!comphubPageEffectsConfiguration) {
      this.comphubPageEffectsActionOverrides = comphubPageEffectsConfiguration.comphubPageEffectsActionOverrides;
    }
  }
}
