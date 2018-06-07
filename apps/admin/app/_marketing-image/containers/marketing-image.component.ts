import { Component, OnInit, EventEmitter, Input, Output, Injectable } from '@angular/core';
import { SuccessEvent, ErrorEvent, UploadEvent, SelectEvent, FileInfo, ClearEvent, FileState, FileRestrictions  } from '@progress/kendo-angular-upload';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';

import * as fromMarketingImageReducer from '../reducers/marketing-image.reducer';
import * as fromMarketingImageActions from '../actions/marketing-image.actions';
import * as fromRootState from 'libs/state/state';

import { environment } from 'environments/environment';

@Component({
  selector: 'pf-marketing-image',
  templateUrl: './marketing-image.component.html',
  styleUrls: ['./marketing-image.component.scss'],
})
export class MarketingImageComponent implements OnInit {
  imgpath = environment.marketingImageSource;
  fileToUpload: File = null;
  previewFileUri: string = "";
  fileName: string = "";
  private errorMessage: string = "";
  private uploadUrl: string = "/odata/CloudFiles.UploadMarketingImage";
  
  fileRestrictions: FileRestrictions = {
    maxFileSize: 200000, allowedExtensions: ['.jpg', '.png']
  };

  constructor(
    private store: Store<fromMarketingImageReducer.State>) { 
  }

  ngOnInit() :void {
  }

  selectEventHandler(e: SelectEvent) {
    var reader  = new FileReader();

    if (e.files[0].rawFile && (e.files[0].extension == ".jpg" || e.files[0].extension == ".png")) {
        reader.readAsDataURL(e.files[0].rawFile);
        
        reader.onloadend = (e) => {
          this.previewFileUri = reader.result;
        }
      }
      else
      {
        this.previewFileUri = "";
      }
  }

  successEventHandler(e: SuccessEvent) {
    //NEED THIS???: this.store.dispatch(new fromMarketingImageActions.SavingFile(this.fileName));
  }

  errorEventHandler(e: ErrorEvent) {
    let body = JSON.stringify(e.response);
    this.errorMessage = body; 
  }

  clearEventHandler(e: ClearEvent) {
    this.previewFileUri = "";
  }

}


