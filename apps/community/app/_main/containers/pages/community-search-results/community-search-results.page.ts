import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunitySearchResultsComponent } from '../../community-search-results';

@Component({
  selector: 'pf-community-search-results-page',
  templateUrl: './community-search-results.page.html',
  styleUrls: [ './community-search-results.page.scss' ]
})

export class CommunitySearchResultsPageComponent implements OnInit {
  @ViewChild(CommunitySearchResultsComponent, { static: true }) searchResultsComponent: CommunitySearchResultsComponent;
  searchQuery: string;

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.searchQuery = this.route.snapshot.queryParams.query;
    this.searchResultsComponent.executeSearch(this.route.snapshot.queryParams.query);
  }

  routeToSearch(routeQuery) {
    this.router.navigate([ '/search-results' ], { queryParams: { query: routeQuery } });
    this.searchResultsComponent.executeSearch(routeQuery);
  }
}
