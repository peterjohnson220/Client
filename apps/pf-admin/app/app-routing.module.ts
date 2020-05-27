import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { NotFoundErrorPageComponent, AccessDeniedPageComponent } from 'libs/ui/common/error/pages';
import { AppWrapperComponent } from 'libs/features/app-root';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'navigation', pathMatch: 'full' },
      { path: 'navigation', loadChildren: () => import('apps/pf-admin/app/_navigation/navigation.module').then(m => m.NavigationModule) },
      { path: 'companies', loadChildren: () => import('apps/pf-admin/app/_companies/company.module').then(m => m.CompanyModule) },
      { path: 'utilities', loadChildren: () => import('apps/pf-admin/app/_utilities/utilities.module').then(m => m.UtilitiesModule) },
      { path: 'pfmarketdatafeed', loadChildren: () =>
          import('apps/pf-admin/app/_market-data-feed/market-data-feed.module').then(m => m.MarketDataFeedPageModule) },
      { path: 'loader-dashboard', loadChildren: () =>
          import('apps/pf-admin/app/_loader-dashboard/loader-dashboard-page.module').then(m => m.LoaderDashboardPageModule)},
      { path: 'access-denied', component: AccessDeniedPageComponent },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
