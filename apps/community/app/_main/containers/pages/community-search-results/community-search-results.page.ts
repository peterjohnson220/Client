import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunitySearchResultsComponent } from '../../community-search-results';
import { CommunitySearchQuery } from 'libs/models/community/community-search-query.model';

import * as constants from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-search-results-page',
  templateUrl: './community-search-results.page.html',
  styleUrls: [ './community-search-results.page.scss' ]
})

export class CommunitySearchResultsPageComponent implements OnInit {
  @ViewChild(CommunitySearchResultsComponent, { static: true }) searchResultsComponent: CommunitySearchResultsComponent;
  searchQuery: string;
  dateOptions = constants.CommunitySearchResultDates;
  sortOptions = constants.CommunitySearchResultSortOptions;

  sortOption = constants.CommunitySearchSortByEnum.Relevance;
  durationOption = constants.CommunitySearchDurationEnum.AllTime;

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.searchQuery = this.route.snapshot.queryParams.query;

    this.searchResultsComponent.executeSearch({
      searchTerm: this.route.snapshot.queryParams.query,
      searchSort : this.sortOption,
      searchDuration: this.durationOption
    });
  }

  routeToSearch(routeQuery) {
    this.searchQuery = routeQuery;
    this.router.navigate([ '/search-results' ], { queryParams: { query: routeQuery } });
    this.searchResultsComponent.executeSearch({
      searchTerm: routeQuery,
      searchSort: this.sortOption,
      searchDuration: this.durationOption});
  }

  dateSelectionChange(searchDuration) {
    this.durationOption = searchDuration.value;
    this.searchResultsComponent.executeSearch( {
      searchTerm: this.searchQuery,
      searchSort: this.sortOption,
      searchDuration: this.durationOption});
  }

  sortBySelectionChange(sortOption) {
    this.sortOption = sortOption.value;
    this.searchResultsComponent.executeSearch({
      searchTerm: this.searchQuery,
      searchSort: this.sortOption,
      searchDuration: this.durationOption});
  }
}
