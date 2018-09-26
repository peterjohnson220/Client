import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pf-community-poll-choices',
  templateUrl: './community-poll-choices.component.html',
  styleUrls: ['./community-poll-choices.component.scss']
})
export class CommunityPollChoicesComponent {

  static enableEditingResponseOptionsStatic = true;

  get enableEditingResponseOptions() { return CommunityPollChoicesComponent.enableEditingResponseOptionsStatic; }
  get getPlaceholder() { return this.index <= 1 ? `Choice ${this.index + 1}` : `Choice ${this.index + 1} (Optional)`; }

  @Input() public index: number;

  @Input() public item: FormGroup;

  @Input() public isAdmin: false;

  @Output() public removed: EventEmitter<number> = new EventEmitter<number>();

  static buildItem(val: string, enableEditingResponseOptions = true) {

    CommunityPollChoicesComponent.enableEditingResponseOptionsStatic = enableEditingResponseOptions;
    const responseOptionControl = new FormControl(val, [Validators.required]);

    if (!enableEditingResponseOptions) {
      responseOptionControl.disable();
    }
    return new FormGroup({
      response: responseOptionControl
    });

  }
}
