import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';

import { ViewsListEffects, UpsertViewModalEffects } from './effects';
import { reducers } from './reducers';
import { ViewsListPageComponent } from './views-list.page';
import { UpsertViewModalComponent, ExportSchedulesModalComponent, TemplatesModalComponent } from './containers';
import * as fromFaIcons from './fa-icons';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_settings_viewsList', reducers),
    EffectsModule.forFeature([ViewsListEffects, UpsertViewModalEffects]),
    DropDownsModule,
    GridModule,
    NgbModule,

    // Payfactors
    PfFormsModule,
    FontAwesomeModule,
    PfCommonUIModule,
    PfCommonModule
  ],
  declarations: [
    // Feature
    ViewsListPageComponent,
    UpsertViewModalComponent,
    ExportSchedulesModalComponent,
    TemplatesModalComponent
  ],
  exports: [
    ViewsListPageComponent,
    UpsertViewModalComponent,
    ExportSchedulesModalComponent,
    TemplatesModalComponent
  ]
})
export class ViewsListModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
