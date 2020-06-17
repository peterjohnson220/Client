import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AppWrapperComponent } from 'libs/features/app-root';
import { AuthorizationGuard } from 'libs/security';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';

export const routes: Routes = [
  {
    path: '',
    component: AppWrapperComponent,
    children: [
      { path: '', loadChildren: () => import('apps/data-management/app/_main/main.module').then(m => m.MainModule) },
      { path: '', loadChildren: () => import('apps/data-management/app/_pricing-loader/pricing-loader.module').then(m => m.PricingLoaderModule) },
      { path: 'pricing-loader',
        loadChildren: () => import('apps/data-management/app/_pricing-loader-download/pricing-loader-download.module')
          .then(m => m.PricingLoaderDownloadModule)
      }
    ]
  },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
