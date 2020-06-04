import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { StoreModule, ActionReducer, MetaReducer, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppWrapperComponent } from './shared/app-wrapper/app-wrapper.component';
import { reducers, AppState } from './shared/state';
import { ApiAuthInterceptor } from './shared/services/api-auth.service';
import { SentryErrorHandler, SentryService } from 'libs/core/services';

export function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state: any, action: any) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState, any>[] = [stateSetter];

export const NGRX_STATE = makeStateKey('NGRX_STATE');

@NgModule({
  declarations: [
    AppWrapperComponent,
    AppComponent],
  imports: [
    // Angular
    BrowserModule.withServerTransition({ appId: 'pf-smallbiz' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Third Party
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),

    // Routing
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiAuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    SentryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly transferState: TransferState, private readonly store: Store<AppState>) {
    const isBrowser = this.transferState.hasKey<any>(NGRX_STATE);
    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  onServer() {
    this.transferState.onSerialize(NGRX_STATE, () => {
      let state;
      this.store.subscribe((saveState: any) => {
        state = saveState;
      }).unsubscribe();

      return state;
    });
  }

  onBrowser() {
    const state = this.transferState.get<any>(NGRX_STATE, null);
    this.transferState.remove(NGRX_STATE);
    this.store.dispatch({ type: 'SET_ROOT_STATE', payload: state });
  }
}
