import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {PfCommonModule} from '../../core';
import { PfCommonUIModule } from '../../ui/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { reducers } from './state/reducers';
import { LoaderSettingsEffects, FileUploadEffects } from './state/effects';
import { FieldMapperComponent, FileUploadComponent } from './components';
import * as fromFaIcons from './fa-icons';

@NgModule({
  // 3rd Party
  imports: [
    StoreModule.forFeature('feature_fileupload', reducers),
    EffectsModule.forFeature([
      LoaderSettingsEffects,
      FileUploadEffects
    ]),
    // NG
    FormsModule,
    CommonModule,
    // PF
    PfCommonModule,
    PfCommonUIModule,
    DropDownsModule,
    UploadModule,
    FontAwesomeModule
  ],
  declarations: [
    FieldMapperComponent,
    FileUploadComponent
  ],
  exports: [FieldMapperComponent, FileUploadComponent]
})
export class PfFieldMapperModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
