import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[pfTileItem]',
})
export class TileItemDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
