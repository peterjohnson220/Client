import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppWrapperComponent } from './shared/app-wrapper/app-wrapper.component';

export const routes: Routes = [
  { path: '', redirectTo: 'job', pathMatch: 'full' },
  {
    path: '',
    component: AppWrapperComponent,
    children: [
      { path: 'login', loadChildren: () => import('./_login/login.module').then(m => m.LoginModule) },
      { path: 'job', loadChildren: () => import('./_job-search/job-search.module').then(m => m.JobSearchModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
