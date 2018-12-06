import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorEvent, UploadEvent, SelectEvent, ClearEvent, FileRestrictions, RemoveEvent } from '@progress/kendo-angular-upload';
import { SuccessEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'pf-marketing-image',
  templateUrl: './marketing-image.component.html',
  styleUrls: ['./marketing-image.component.scss'],
})
export class MarketingImageComponent implements OnInit {
  previewFileUri: any;
  errorMessage = '';
  uploadSaveUrl = '/odata/Marketing.UploadMarketingImage';
  url: string;
  marketingForm: FormGroup;
  submitted = false;
  headerStatus = '';
  fileRestrictions: FileRestrictions = {
    maxFileSize: 4000000, allowedExtensions: ['jpg', 'jpeg', 'png']
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.marketingForm = this.fb.group({
      url: [this.url, [Validators.minLength(4)]]
    });
  }

  selectEventHandler(e: SelectEvent) {
    const reader  = new FileReader();
    this.errorMessage = '';
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
        redirectUrl: this.marketingForm.get('url').value
      };
    }
  }

  successEventHandler(e: SuccessEvent) {
    this.headerStatus = 'Image uploaded successfully!';
  }

  errorEventHandler(e: ErrorEvent) {
    this.errorMessage = e.response['message'] + ': ' + e.response['error']['value'];
    this.headerStatus = 'Something went wrong...';
    this.previewFileUri = '';
  }

  clearEventHandler(e: ClearEvent) {
    this.previewFileUri = '';
  }

  removeEventHandler(e: RemoveEvent) {
    this.previewFileUri = '';
  }
}
