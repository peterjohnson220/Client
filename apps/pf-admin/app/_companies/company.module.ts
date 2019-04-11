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
import { CompaniesEffects } from './effects';
import { reducers } from './reducers';
import { CompanyRoutingModule } from './company-routing.module';

@NgModule({
    imports: [
        // Angular
        CommonModule, FormsModule, ReactiveFormsModule,

        // 3rd Party
        StoreModule.forFeature('pfadmin_companies', reducers),
        EffectsModule.forFeature([
            CompaniesEffects
        ]),
        GridModule,
        LayoutModule,

        // Routing
        CompanyRoutingModule,

        // Payfactors
        PfCommonUIModule,
        PfFormsModule,
    ],
    declarations: [
        // Components
        CompaniesListComponent,

        // Pages
        CompaniesListPageComponent,

        // Pipes
        CompanySearchPipe,
    ]
})
export class CompanyModule { }
