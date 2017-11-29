import { Component, Input } from '@angular/core';

@Component({
  template: `
    <div>
      <strong>{{data.name}}</strong>
    </div>
  `
})
export class TileItemComponent  {
  @Input() data: any;
}


