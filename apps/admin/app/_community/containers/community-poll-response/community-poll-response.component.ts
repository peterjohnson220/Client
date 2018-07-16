import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pf-community-poll-response',
  templateUrl: './community-poll-response.component.html',
  styleUrls: ['./community-poll-response.component.scss']
})
export class CommunityPollResponseComponent {

  @Input() public index: number;

  @Input() public item: FormGroup;

  @Output() public removed: EventEmitter<number> = new EventEmitter<number>();

  static buildItem(val: string) {
    return new FormGroup({
      response: new FormControl(val, Validators.required)
    });
  }
}
