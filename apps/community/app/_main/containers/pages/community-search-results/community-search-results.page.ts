import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'pf-community-search-results-page',
  templateUrl: './community-search-results.page.html',
  styleUrls: [ './community-search-results.page.scss' ]
})
export class CommunitySearchResultsPageComponent implements OnInit {

  searchQuery: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.searchQuery = this.route.snapshot.queryParams.query;
  }

  ngOnInit() {
  }

  executeSearchEvent(searchQuery) {
    this.router.navigate(['/search-results'], { queryParams: { query: searchQuery } });
  }
}
