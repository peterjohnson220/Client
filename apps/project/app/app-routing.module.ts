import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';
import { AppWrapperComponent } from 'libs/features/infrastructure/app-root';
import { DEFAULT_ROUTES } from 'libs/ui/common';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', redirectTo: 'project-list', pathMatch: 'full'},
      { path: 'pricing-project', loadChildren: () =>
          import('apps/project/app/_pricing-project/pricing-project-page.module').then(m => m.PricingProjectPageModule) },
      { path: 'project-list', loadChildren: () =>
          import('apps/project/app/_project-list/project-list-page.module').then(x => x.ProjectListPageModule)}
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
