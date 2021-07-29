import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard, FeatureFlagGuard } from 'libs/security/guards';
import { FeatureFlags } from 'libs/core/services/feature-flags';

import {
  ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent, ExchangeJobsComponent,
  ExchangeAccessRequestsComponent, PayfactorsCompanyExchangeInvitationsComponent,
  NewCompanyExchangeInvitationsComponent, ExchangeJobRequestsComponent, ExchangeJobAssociationUtilityPageComponent,
  ManageExchangeFiltersComponent, TagCategoriesPageComponent, StandardScopesComponent
} from './containers';
import { ExchangeExistsGuard } from './guards';

const routes: Routes = [
  { path: '', redirectTo: 'exchanges', pathMatch: 'full' },
  { path: 'exchanges', component: ExchangeListPageComponent, canActivate: [PfAdminGuard] },
  { path: 'exchange/:id', component: ManageExchangePageComponent, canActivate: [PfAdminGuard, ExchangeExistsGuard],
    children: [
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
      { path: 'companies', component: ExchangeCompaniesComponent },
      { path: 'jobs', component: ExchangeJobsComponent },
      { path: 'accessrequests', component: ExchangeAccessRequestsComponent },
      { path: 'companyinvitations', component: PayfactorsCompanyExchangeInvitationsComponent },
      { path: 'companyreferrals', component: NewCompanyExchangeInvitationsComponent },
      { path: 'jobrequests', component: ExchangeJobRequestsComponent },
      { path: 'exchangefilters', component: ManageExchangeFiltersComponent },
      {
        path: 'standardscopes',
        component: StandardScopesComponent,
        canActivate: [FeatureFlagGuard],
        data: {
          featureFlag: {
            name: FeatureFlags.ExchangeManagementSystemScopes,
            defaultValue: false
          }
        }
      },
    ]
  },
  { path: 'exchangejobassociationutility', component: ExchangeJobAssociationUtilityPageComponent, canActivate: [PfAdminGuard] },
  { path: 'tagcategories', component: TagCategoriesPageComponent, canActivate: [PfAdminGuard]},
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerAdminRoutingModule { }
