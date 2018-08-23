import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pf-community-poll-response',
  templateUrl: './community-poll-response.component.html',
  styleUrls: ['./community-poll-response.component.scss']
})
export class CommunityPollResponseComponent {

  static enableEditingResponseOptionsStatic = true;
  get enableEditingResponseOptions() { return CommunityPollResponseComponent.enableEditingResponseOptionsStatic; }

  @Input() public index: number;

  @Input() public item: FormGroup;

  @Output() public removed: EventEmitter<number> = new EventEmitter<number>();

  static buildItem(val: string, enableEditingResponseOptions: boolean) {

    CommunityPollResponseComponent.enableEditingResponseOptionsStatic = enableEditingResponseOptions;
    const responseOptionControl = new FormControl(val, [Validators.required]);

    if (!enableEditingResponseOptions) {
      responseOptionControl.disable();
    }
    return new FormGroup({
      response: responseOptionControl
    });

  }
}
