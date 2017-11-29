import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tileItem]',
})
export class TileItemDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
