import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss']
})
export class ButtonIconComponent {
  @Input() iconName: string;
  @Input() iconStyle: string;
  @Input() tooltipMsg: string;
  @Input() tooltipPlacement: string;
  @Output() selected = new EventEmitter();

  onIconSelected(): void {
    this.selected.emit();
  }
}
