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
      { path: 'navigation', loadChildren: 'apps/pf-admin/app/_navigation/navigation.module#NavigationModule' },
      { path: 'companies', loadChildren: 'apps/pf-admin/app/_companies/company.module#CompanyModule' },
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
