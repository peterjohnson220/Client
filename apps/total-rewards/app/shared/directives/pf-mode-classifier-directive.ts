import { Directive, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';

import { StatementModeEnum } from '../models';

@Directive({ selector: '[pfModeClassifierDirective]' })
export class ModeClassifierDirective implements OnChanges {
  @Input() mode: StatementModeEnum;

  editClass = 'edit-mode';
  previewClass = 'preview-mode';
  printClass = 'print-mode';

  constructor(public elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.mode) {
      return;
    }

    // remove any existing mode classes added from previous changes
    const { classList } = this.elementRef.nativeElement as HTMLElement;
    for (let i = 0; i < classList.length; i++) {
      if (classList[i] === this.editClass || classList[i] === this.previewClass || classList[i] === this.printClass) {
        classList.remove(classList[i]);
      }
    }

    // add a new class corresponding to the statement mode
    if (this.mode === StatementModeEnum.Edit) {
      classList.add(this.editClass);
    } else if (this.mode === StatementModeEnum.Preview) {
      classList.add(this.previewClass);
    } else if (this.mode === StatementModeEnum.Print) {
      classList.add(this.printClass);
    }
  }
}
