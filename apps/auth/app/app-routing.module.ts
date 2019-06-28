import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { AppWrapperComponent } from './app-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    children: [
      { path: '', loadChildren: () => import('apps/auth/app/_login/login.module').then(m => m.LoginModule) },
      { path: 'registration', loadChildren: () => import('apps/auth/app/_registration/registration.module').then(m => m.RegistrationModule) },
      { path: '**', component: NotFoundErrorPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
