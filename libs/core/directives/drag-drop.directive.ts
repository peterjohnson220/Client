import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[pfDragDrop]'
})

export class DragDropDirective {

  constructor(private el: ElementRef) { }

  @Output() onFileDropped = new EventEmitter<any>();
  @Input() dragOverBGColor = '#3495eb';
  @Input() BGColor = '#F1F1F1';

  @HostBinding('style.background-color') private background = this.BGColor;
  @HostBinding('style.opacity') private opacity = '1';

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.highLight(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.highLight(false);
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.highLight(false);
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files[0]);
    }
  }

  private highLight(isOn: boolean) {
    if (isOn) {
      this.el.nativeElement.style.backgroundColor = this.dragOverBGColor;
      this.el.nativeElement.style.opacity = '0.8';
    } else {
      this.el.nativeElement.style.backgroundColor = this.BGColor;
      this.el.nativeElement.style.opacity = '1';
    }
  }
}
