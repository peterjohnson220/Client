import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Action, select, Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { SearchFilter } from 'libs/models/payfactors-api/search/response';
import { PagingOptions } from 'libs/models/payfactors-api';

import * as fromInfiniteScrollActions from '../actions/infinite-scroll.actions';
import * as fromInfiniteScrollReducer from '../reducers';
import { ScrollPagingOptions } from '../models';


export class InfiniteScrollActionContext extends Observable<Action> {
  scrollId: string;
  action: fromInfiniteScrollActions.Load|fromInfiniteScrollActions.LoadMore;
  scrollPagingOptions: ScrollPagingOptions;

  constructor(scrollId: string, action: fromInfiniteScrollActions.Load|fromInfiniteScrollActions.LoadMore, scrollPagingOptions: ScrollPagingOptions) {
    super();
    this.scrollId = scrollId;
    this.action = action;
    this.scrollPagingOptions = scrollPagingOptions;
  }

  get isLoadAction(): boolean {
    return this.action.type === fromInfiniteScrollActions.LOAD;
  }

  get pagingOptions(): PagingOptions {
    const pagingOptions = this.scrollPagingOptions;
    return {
      From: pagingOptions.pageSize * (pagingOptions.page - 1),
      Count: pagingOptions.pageSize
    };
  }

  throwError(err?: any): Observable<fromInfiniteScrollActions.LoadError|fromInfiniteScrollActions.LoadMoreError> {
    const payload = {scrollId: this.scrollId, error: err};
    const errorAction = this.isLoadAction ? new fromInfiniteScrollActions.LoadError(payload) : new fromInfiniteScrollActions.LoadMoreError(payload);
    return of(errorAction);
  }
  scrollSuccessful<TState, TResult>(store: Store<TState>, response: TResult[]): void;
  scrollSuccessful<TState>(store: Store<TState>, response: SearchFilter): void;
  scrollSuccessful<TState>(store: Store<TState>, response: any): void {
    const scrollPayload = {
      scrollId: this.scrollId,
      lastReturnedCount: response?.length ?? response.Options.length
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
