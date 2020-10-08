import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DEFAULT_ROUTES } from 'libs/ui/common';

import { FormAppWrapperComponent } from './shared/components';

export const routes: Routes = [
  {
    path: '',
    component: FormAppWrapperComponent,
    children: [
      {
        path: 'peer-network-signup',
        loadChildren: () => import('apps/form/app/_peer-exchange-signup/peer-exchange-signup.module').then(m => m.PeerExchangeSignupModule)
      },
      {
        path: 'ecommerce',
        loadChildren: () => import('apps/form/app/_ecommerce/ecommerce.module').then(m => m.ECommerceModule)
      },
      { path: '**', redirectTo: '/not-found' }
    ]
  },
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
