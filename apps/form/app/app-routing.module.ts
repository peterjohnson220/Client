import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

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
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
