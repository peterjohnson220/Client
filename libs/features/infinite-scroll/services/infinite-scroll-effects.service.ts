import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Action, select, Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ResultsPagingOptions } from 'libs/features/search/models';
import { SearchFilter } from 'libs/models/payfactors-api/search/response';

import * as fromInfiniteScrollActions from '../actions/infinite-scroll.actions';
import * as fromInfiniteScrollReducer from '../reducers';


export class InfiniteScrollActionContext extends Observable<Action> {
  scrollId: string;
  action: fromInfiniteScrollActions.Load|fromInfiniteScrollActions.LoadMore;
  pagingOptions: ResultsPagingOptions;

  constructor(scrollId: string, action: fromInfiniteScrollActions.Load|fromInfiniteScrollActions.LoadMore, pagingOptions: ResultsPagingOptions) {
    super();
    this.scrollId = scrollId;
    this.action = action;
    this.pagingOptions = pagingOptions;
  }

  get isLoadAction(): boolean {
    return this.action.type === fromInfiniteScrollActions.LOAD;
  }

  throwError(): Observable<fromInfiniteScrollActions.LoadError> {
    return of(new fromInfiniteScrollActions.LoadError({scrollId: this.scrollId}));
  }

  scrollSuccessful<TState>(store: Store<TState>, searchFilter: SearchFilter): void {
    const scrollPayload = {
      scrollId: this.scrollId,
      lastReturnedCount: searchFilter.Options.length
    };
    const successAction = this.isLoadAction ?
      new fromInfiniteScrollActions.LoadSuccess(scrollPayload) : new fromInfiniteScrollActions.LoadMoreSuccess(scrollPayload);

    store.dispatch(successAction);
  }
}

@Injectable()
export class InfiniteScrollEffectsService {

  infiniteScrollActions$(scrollId: string): Observable<InfiniteScrollActionContext> {
    return this.actions$
      .pipe(
        ofType(fromInfiniteScrollActions.LOAD, fromInfiniteScrollActions.LOAD_MORE),
        filter((action: fromInfiniteScrollActions.Load|fromInfiniteScrollActions.LoadMore) =>
          action.payload.scrollId === scrollId),
        withLatestFrom(
          this.store.pipe(select(fromInfiniteScrollReducer.getPagingOptions, scrollId)),
          (action: fromInfiniteScrollActions.Load|fromInfiniteScrollActions.LoadMore, pagingOptions) =>
            new InfiniteScrollActionContext(scrollId, action, pagingOptions))
      );
  }

  constructor(private store: Store<fromInfiniteScrollReducer.State>, private actions$: Actions) { }
}
