import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages';
import { PfAdminGuard } from 'libs/security/guards';

import {
  ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent, ExchangeJobsComponent,
  ExchangeAccessRequestsComponent, PayfactorsCompanyExchangeInvitationsComponent,
  NewCompanyExchangeInvitationsComponent, ExchangeJobRequestsComponent, ExchangeJobAssociationUtilityPageComponent,
  ManageExchangeFiltersComponent, TagCategoriesPageComponent
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
      { path: 'exchangefilters', component: ManageExchangeFiltersComponent }
    ]
  },
  { path: 'exchangejobassociationutility', component: ExchangeJobAssociationUtilityPageComponent, canActivate: [PfAdminGuard] },
  { path: 'tagcategories', component: TagCategoriesPageComponent, canActivate: [PfAdminGuard]},
  { path: 'exchange-not-found', component: NotFoundErrorPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerAdminRoutingModule { }
