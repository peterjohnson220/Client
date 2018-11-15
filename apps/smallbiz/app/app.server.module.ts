import { NgModule, Inject } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { Store } from '@ngrx/store';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AppState } from './shared/state';
import * as fromUserContextAction from './shared/actions/user-context.actions';
import { UserContext } from './shared/models';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule
  ],
  providers: [
    // Add universal-only providers here
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(@Inject('userContext') private userContext: UserContext, private readonly store: Store<AppState>) {
    if (!!userContext) {
      store.dispatch(new fromUserContextAction.Set(userContext));
    }
  }
}
