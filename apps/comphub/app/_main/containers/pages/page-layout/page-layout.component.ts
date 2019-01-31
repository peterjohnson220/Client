import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pf-comphub-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {
  @Input() pageTitle = '';
  @Input() pageSubTitle = '';
  @Input() pageIconClass = '';

  constructor() { }

  ngOnInit() {
  }

}
