import { Component, ViewChild } from '@angular/core';
import { CommunityPostsComponent } from '../../community-posts';

@Component({
  selector: 'pf-community-dashboard-page',
  templateUrl: './community-dashboard.page.html',
  styleUrls: [ './community-dashboard.page.scss' ]
})
export class CommunityDashboardPageComponent {

  constructor() { }

  @ViewChild('posts') postsComponent: CommunityPostsComponent;

  onScroll() {
    this.postsComponent.onScroll();
  }
}
