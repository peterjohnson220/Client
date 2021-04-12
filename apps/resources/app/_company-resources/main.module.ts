import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// PF
import { MainRoutingModule } from './main-routing.module';
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
// Third party
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { UploadModule } from '@progress/kendo-angular-upload';
import * as fromFaIcons from './fa-icons';
// Reducers
import { reducers } from './reducers';
// Effects
import { CompanyResourcesPageEffects } from './effects/company-resources.effects';
// Pages
import { CompanyResourcesPageComponent } from './company-resources.page/company-resources.page';
// Containers
import { CompanyResourceListComponent } from './containers/company-resource-list';
import { NewFolderModalComponent } from './containers/new-folder-modal/new-folder-modal.component';
import { ResourceModalComponent } from './containers/resource-modal/resource-modal.component';
// Components
import { DeleteModalComponent, ResourcesComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // 3rd Party
    StoreModule.forFeature('resourcesMain', reducers),
    EffectsModule.forFeature([
      CompanyResourcesPageEffects
    ]),
    FontAwesomeModule,
    NgbModule,
    UploadModule,
    DropDownsModule,
    NgbDropdownModule,
    // Routing
    MainRoutingModule,
    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    CompanyResourcesPageComponent,
    ResourcesComponent,
    CompanyResourceListComponent,
    NewFolderModalComponent,
    ResourceModalComponent,
    DeleteModalComponent
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








