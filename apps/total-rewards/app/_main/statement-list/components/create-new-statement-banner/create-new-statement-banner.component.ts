import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-create-new-statement-banner',
  templateUrl: './create-new-statement-banner.component.html',
  styleUrls: ['./create-new-statement-banner.component.scss']
})
export class CreateNewStatementBannerComponent {
  @Output() createNewClicked = new EventEmitter();

  constructor() { }

  onCreateNewClick() {
    this.createNewClicked.emit();
  }

}
