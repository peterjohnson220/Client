import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { BodyModule, ColumnResizingService, GridModule, RowFilterModule, SharedModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { PfCommonModule } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { TicketDetailCardComponent } from './components';
import {
  AttachmentDeleteModalComponent, AttachmentDetailCardComponent, CompanyDetailCardComponent, TicketComponent, TicketFieldsComponent,
  TicketListComponent, TicketListPageComponent, AttachmentUploadComponent, TicketListFilterComponent,
  TicketCommentsDetailComponent, ClientDetailModalComponent,
  TicketCommentComponent, TicketValuePickerComponent, TicketListDateRangeFilterComponent
} from './containers';
import { TicketAttachmentEffects, TicketEffects, TicketListEffects, TicketLookupEffects } from './effects';
import { reducers } from './reducers';
import { TicketsRoutingModule } from './tickets-routing.module';
import { GetUploadProgressCssClassPipe, GetFileValidationErrorMessagePipe } from './pipes';
import * as fromFaIcons from './fa-icons';
import { TicketSharedEffects } from './effects/ticket-shared.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('admin_tickets', reducers),
    EffectsModule.forFeature([
      TicketEffects,
      TicketListEffects,
      TicketLookupEffects,
      TicketAttachmentEffects,
      TicketSharedEffects
    ]),
    GridModule,
    SharedModule,
    BodyModule,
    LayoutModule,
    ComboBoxModule,
    NgbTabsetModule,
    NgbTooltipModule,
    UploadModule,
    RowFilterModule,
    FontAwesomeModule,
    DateInputsModule,

    // Routing
    TicketsRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule
  ],
  declarations: [
    // Pipes
    GetUploadProgressCssClassPipe,
    GetFileValidationErrorMessagePipe,

    // Components
    AttachmentDetailCardComponent,
    CompanyDetailCardComponent,
    TicketDetailCardComponent,

    // Containers
    TicketListComponent,
    TicketComponent,
    TicketFieldsComponent,
    AttachmentDeleteModalComponent,
    AttachmentUploadComponent,
    TicketListFilterComponent,
    TicketCommentsDetailComponent,
    TicketCommentComponent,
    TicketValuePickerComponent,
    TicketListDateRangeFilterComponent,
    ClientDetailModalComponent,

    // Pages
    TicketListPageComponent
  ],
  providers: [
    WindowRef,
    ColumnResizingService
  ]
})
export class TicketsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
