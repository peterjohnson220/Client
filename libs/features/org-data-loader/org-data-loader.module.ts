import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { LoaderSettingsEffects } from './state/effects/loader-settings.effects';
import { FieldMapperComponent } from './components';
import { PfCommonUIModule } from '../../ui/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      LoaderSettingsEffects
    ]),

    FormsModule,
    CommonModule,
    PfCommonUIModule,
    DropDownsModule,
    UploadModule
  ],
  declarations: [
    FieldMapperComponent
  ],
  exports: [FieldMapperComponent]
})
export class PfFieldMapperModule { }
