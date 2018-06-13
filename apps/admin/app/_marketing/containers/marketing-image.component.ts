import { Component, OnInit, EventEmitter, Input, Output, Injectable, TemplateRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SuccessEvent, ErrorEvent, UploadEvent, SelectEvent, ClearEvent, FileRestrictions, RemoveEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'pf-marketing-image',
  templateUrl: './marketing-image.component.html',
  styleUrls: ['./marketing-image.component.scss'],
})
export class MarketingImageComponent implements OnInit {
  previewFileUri = '';
  errorMessage = '';
  uploadSaveUrl = '/odata/CloudFiles.UploadMarketingImage';
  url: string;
  marketingForm: FormGroup;
  submitted = false;
  fileRestrictions: FileRestrictions = {
    maxFileSize: 2000000, allowedExtensions: ['jpg', 'jpeg', 'png']
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.marketingForm = this.fb.group({
      url: [this.url, [Validators.minLength(4)]]
    });
  }

  selectEventHandler(e: SelectEvent) {
    const reader  = new FileReader();

    if (e.files[0].rawFile && (e.files[0].extension === '.jpg' || e.files[0].extension === '.png')) {
        reader.readAsDataURL(e.files[0].rawFile);
        reader.onloadend = (progressEvent) => {
          this.previewFileUri = reader.result;
        };
      } else {
        this.previewFileUri = '';
      }
  }

  uploadEventHandler(e: UploadEvent) {
    this.submitted = true;

    if (!this.marketingForm.valid) {
      this.previewFileUri = '';
      e.preventDefault();
    } else {
      e.data = {
        imageUrl: this.marketingForm.get('url').value
      };
    }
  }

  successEventHandler(e: SuccessEvent) {
    // TODO: Nothing to do here for now...
  }

  errorEventHandler(e: ErrorEvent) {
    const body = JSON.stringify(e.response);
    this.errorMessage = body;
  }

  clearEventHandler(e: ClearEvent) {
    this.previewFileUri = '';
  }

  removeEventHandler(e: RemoveEvent) {
    this.previewFileUri = '';
  }
}