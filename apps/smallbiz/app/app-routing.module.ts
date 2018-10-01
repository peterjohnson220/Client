import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppWrapperComponent } from './shared/app-wrapper/app-wrapper.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: AppWrapperComponent,
    children: [
      { path: 'login', loadChildren: './_login/login.module#LoginModule' },
      { path: 'home', loadChildren: './_home/home.module#HomeModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
