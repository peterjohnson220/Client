import { Input, Output, EventEmitter } from '@angular/core';

export enum PanelState {
    Default,
    Error,
    Complete
}

export abstract class BaseTogglePanel {
  @Input() isToggled = true;
  @Output() notifyComplete: EventEmitter<any> = new EventEmitter();
  @Output() notifyCancel: EventEmitter<any> = new EventEmitter();
  @Input() panelId: any;
  panelState: PanelState = PanelState.Default;
  _panelState: typeof PanelState = PanelState;
  constructor() { }

  handleHeaderClick() {
    this.isToggled = !this.isToggled;
  }

  onComplete() {
    this.notifyComplete.emit(this.panelId);
  }

  onCancel() {
    this.notifyCancel.emit(this.panelId);
  }

  resetPanelState() {
    this.panelState = PanelState.Default;
  }
}
