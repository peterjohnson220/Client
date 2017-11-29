import { Component, OnInit, ViewEncapsulation, Input, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Tile } from '../../../models/tile.model';
import { TileItemDirective } from '../../../directives/tile-item.directive';
import { TileItem } from '../../../models/tile-item.model';
import { TileItemComponent } from '../tile-item/tile-item.component';


@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class TileComponent implements OnInit {

  @Input() tile: Tile;
  @ViewChild(TileItemDirective) adHost: TileItemDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() { }

  tileClick() {

    this.loadTileItemComponent();
  }

  loadTileItemComponent()
  {
    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const tileItem = new TileItem(TileItemComponent, { name: 'test dynamically loaded tile item component' });
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tileItem.component);
    const componentRef = viewContainerRef.createComponent(componentFactory);

    (componentRef.instance).data = tileItem.data;
  }
}
