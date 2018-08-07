import { Component, OnInit, Input } from '@angular/core';

import { DataCut } from '../../models';

@Component({
  selector: 'pf-data-cuts',
  templateUrl: './data-cuts.component.html',
  styleUrls: ['./data-cuts.component.scss']
})
export class DataCutsComponent implements OnInit {

  @Input() dataCuts: DataCut[];
  @Input() currencyCode: string;

  constructor() { }

  ngOnInit() {
  }

}
