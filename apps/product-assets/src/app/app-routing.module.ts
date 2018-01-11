import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { UserContextGuard } from 'libs/security';
import { AppWrapperComponent } from 'libs/features';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      {
        path: '',
        loadChildren: 'apps/product-assets/src/app/_pay-intelligence/pay-intelligence.module#PayIntelligenceModule'
      },
      {
        path: 'pay-intelligence',
        loadChildren: 'apps/product-assets/src/app/_pay-intelligence/pay-intelligence.module#PayIntelligenceModule'
      },
      {
        path: '**',
        component: NotFoundErrorPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
