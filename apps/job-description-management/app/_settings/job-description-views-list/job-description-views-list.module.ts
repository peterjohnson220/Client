import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobDescriptionViewsListPageComponent } from './job-description-views-list.page';

@NgModule({
  imports: [
    // Angular
    CommonModule
  ],
  declarations: [
    // Feature
    JobDescriptionViewsListPageComponent,
  ],
  exports: [
    JobDescriptionViewsListPageComponent,
  ]
})
export class JobDescriptionViewsListModule {
  constructor() { }
}
