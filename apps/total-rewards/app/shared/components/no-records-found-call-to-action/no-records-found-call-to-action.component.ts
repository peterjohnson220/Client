import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-no-records-found-call-to-action',
  templateUrl: './no-records-found-call-to-action.component.html',
  styleUrls: ['./no-records-found-call-to-action.component.scss']
})
export class NoRecordsFoundCallToActionComponent {
  @Input() headerText = 'No Records Found';
  @Input() preLinkText = '';
  @Input() linkText = '';

  @Output() callToActionClick = new EventEmitter();

  onCallToActionClick() {
    this.callToActionClick.emit();
  }

}
