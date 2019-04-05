import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pf-community-search',
  templateUrl: './community-search.component.html',
  styleUrls: ['./community-search.component.scss']
})
export class CommunitySearchComponent implements OnInit {

  @Input() searchBoxText: string;
  @Output() searchEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onKeyDown(event) {
    if (event.keyCode === 13 && this.searchBoxText.trim().length > 0) {
      this.searchEvent.emit(this.searchBoxText);
    }
  }

  clearValue() {
    this.searchBoxText = '';
  }

  searchClick() {
    this.searchEvent.emit(this.searchBoxText);
  }

  isClear() {
    return !this.searchBoxText || this.searchBoxText.length < 1;
  }
}
