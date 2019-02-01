import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { reducer } from './reducers/file-download.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('feature_fileDownload', reducer),
  ],
})
export class PfFileDownloadModule { }
