import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { environment } from 'environments/environment';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms';

import { PfSearchModule } from '../../search';
import { SearchFilterMappingDataObj } from '../../search/models';
import { UserFilterTypeData } from '../../user-filter/models';
import { PfPeerMapModule } from '../map';

import { ExchangeExplorerComponent, ExchangeScopeSelectorComponent, ExchangeExplorerMapComponent } from './containers';
import { WeightingTypeDropdownComponent } from './components';
import { reducers } from './reducers';
import {
  ExchangeExplorerEffects,
  ExchangeFilterContextEffects,
  ExchangeFilterEffects,
  ExchangeScopeEffects,
  ExchangeSearchEffects,
  SingledFilterEffects,
  ExchangeExplorerMapEffects,
  ChildFilterEffects
} from './effects';
import { ExchangeExplorerContextService } from './services';
import * as fromFaIcons from './fa-icons';

const declarations = [
  ExchangeExplorerMapComponent,
  ExchangeScopeSelectorComponent,
  ExchangeExplorerComponent,
  WeightingTypeDropdownComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // 3rd Party
    StoreModule.forFeature('feature_peer_exchangeExplorer', reducers),
    EffectsModule.forFeature([
      ChildFilterEffects, ExchangeScopeEffects, ExchangeFilterContextEffects, ExchangeFilterEffects,
      ExchangeSearchEffects, SingledFilterEffects, ExchangeExplorerEffects, ExchangeExplorerMapEffects
    ]),
    SwitchModule,
    DropDownListModule,
    NgxMapboxGLModule,
    NgbPopoverModule,
    FontAwesomeModule,

    // PF Modules
    PfCommonUIModule,
    PfPeerMapModule,
    PfSearchModule,
    PfFormsModule
  ],
  providers: [
    ExchangeExplorerContextService,
    { provide: SearchFilterMappingDataObj, useValue: {} },
    { provide: UserFilterTypeData, useValue: '' }
  ],
  declarations: declarations,
  exports: declarations
})
export class PfExchangeExplorerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
