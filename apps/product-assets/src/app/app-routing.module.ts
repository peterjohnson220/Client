import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';

import { AppWrapperComponent } from './app-wrapper.component';
import { NotFoundErrorPageComponent } from '../../../../libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', loadChildren: 'apps/product-assets/src/app/_comp-influencers/comp-influencers.module#CompInfluencersModule' },
      { path: 'comp-influencers', loadChildren: 'apps/product-assets/src/app/_comp-influencers/comp-influencers.module#CompInfluencersModule' },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
