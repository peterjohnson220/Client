import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { AppComponent } from './app.component';
import { AppWrapperComponent } from './app-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    children: [
      { path: '', loadChildren: 'apps/auth/src/app/_login/login.module#LoginModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
