import { NgModule } from '@angular/core';

import { HumanizeNumberPipe, TruncateAfterPipe } from './pipes';
import { EffectsModule } from '@ngrx/effects';
import { ClientSettingsEffects} from './effects';


const declarations = [
  // Pipes
  HumanizeNumberPipe, TruncateAfterPipe
];

@NgModule({
  imports: [
    EffectsModule.forFeature([ ClientSettingsEffects ]),
  ],
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
