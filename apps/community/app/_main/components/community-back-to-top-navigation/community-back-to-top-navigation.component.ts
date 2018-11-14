import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'pf-community-back-to-top-navigation',
  templateUrl: './community-back-to-top-navigation.component.html',
  styleUrls: ['./community-back-to-top-navigation.component.scss']
})
export class CommunityBackToTopNavigationComponent {
  @Output() backToTopClicked = new EventEmitter<boolean>();

  constructor() {}

  onClick() {
    this.backToTopClicked.emit();
  }
}
