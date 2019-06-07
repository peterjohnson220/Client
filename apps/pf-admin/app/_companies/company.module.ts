import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { CompanySearchPipe } from './pipes';
import { CompaniesListPageComponent, CompaniesListComponent } from './containers';
import { SiteAdminUsersListPageComponent } from './components/pages/site-admin-users-list';
import { CompaniesEffects } from './effects';
import { reducers } from './reducers';
import { CompanyRoutingModule } from './company-routing.module';
import { UsersModule } from '../../../../libs/features/pf-admin/users';
import { UsersListEffects } from '../../../../libs/features/pf-admin/users/effects';

@NgModule({
    imports: [
        // Angular
        CommonModule, FormsModule, ReactiveFormsModule,

        // 3rd Party
        StoreModule.forFeature('pfadmin_companies', reducers),
        EffectsModule.forFeature([
            CompaniesEffects,
            UsersListEffects,
        ]),
        GridModule,
        LayoutModule,

        // Routing
        CompanyRoutingModule,

        // Payfactors
        PfCommonUIModule,
        PfFormsModule,
        UsersModule,
    ],
    declarations: [
        // Components
        CompaniesListComponent,

        // Pages
        CompaniesListPageComponent,
        SiteAdminUsersListPageComponent,

        // Pipes
        CompanySearchPipe,
    ]
})
export class CompanyModule { }
