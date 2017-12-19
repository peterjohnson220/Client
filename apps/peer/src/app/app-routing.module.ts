import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContextGuard } from 'libs/security';

import { AppWrapperComponent } from './app-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    canActivate: [UserContextGuard],
    children: [
      { path: '', loadChildren: 'apps/peer/src/app/_main/main.module#MainModule' },
      { path: 'peer', redirectTo: '', pathMatch: 'prefix'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
