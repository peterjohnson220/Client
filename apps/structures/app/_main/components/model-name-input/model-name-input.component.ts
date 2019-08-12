import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-model-name-input-component',
  templateUrl: './model-name-input.component.html',
  styleUrls: ['./model-name-input.component.scss']
})
export class ModelNameInputComponent {
  @Input() isEditModelNameLoading: boolean;
  @Input() inEditModelNameMode: boolean;
  @Input() currentModelName: string;
  @Input() newModelName: string;
  @Input() editModelNameError: string;

  @Output() updateModelName = new EventEmitter();

  private didMouseDownInInput = false;

  constructor() {
  }

  // clear edit model name when in edit mode
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.inEditModelNameMode && event.key.toLowerCase().startsWith('esc')) {
      this.newModelName = null;
      return false;
    } else if (this.inEditModelNameMode && event.key.toLowerCase() === 'enter') {
      this.setEditModelNameMode(false);
      return false;
    }
  }

  setEditModelNameMode(isInEditModelNameMode: boolean) {
    const mouseDownInInputWasTrue = this.didMouseDownInInput;
    this.didMouseDownInInput = false;

    if (mouseDownInInputWasTrue) {
      return;
    }
    if (isInEditModelNameMode) {
      this.updateNewModelName(this.currentModelName);
      this.inEditModelNameMode = true;
    } else {
      this.updateCurrentModelName(this.newModelName);
      if (this.newModelName) {
        this.updateModelName.emit(this.newModelName);
      }
      this.inEditModelNameMode = false;
      this.updateNewModelName(null);
    }
  }

  updateNewModelName(modelName: string) {
    this.newModelName = modelName;
  }

  updateCurrentModelName(modelName: string) {
    if (modelName) {
      this.currentModelName = modelName;
    }
  }

  mouseDownInInput() {
    this.didMouseDownInInput = true;
  }
}
