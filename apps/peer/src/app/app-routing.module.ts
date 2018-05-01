import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { UserContextGuard } from 'libs/security/index';
import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { AppWrapperComponent } from 'libs/features/app-root/app-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'exchange', pathMatch: 'full' },
      { path: 'exchange', loadChildren: 'apps/peer/src/app/_dashboard/dashboard.module#DashboardModule' },
      { path: 'manage-exchange', loadChildren: 'apps/peer/src/app/_manage/manage.module#ManageModule' },
      // { path: 'exchange-map', loadChildren: 'apps/peer/src/app/_main/main.module#MapModule' }
      { path: 'access-denied', component: AccessDeniedPageComponent },
      { path: 'exchange-not-found', component: NotFoundErrorPageComponent },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
