import { NgModule } from '@angular/core';
import { HumanizeNumberPipe } from './core/pipes';


const declarations = [
  // Pipes
  HumanizeNumberPipe
];

@NgModule({
  imports: [],
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
