import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AppWrapperComponent } from 'libs/features/app-root';
import { DEFAULT_ROUTES } from 'libs/ui/common';

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
  ...DEFAULT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
