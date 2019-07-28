import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCommunityTopicReducer from '../../reducers';
import * as fromCommunityTopicActions from '../../actions/community-topic.actions';
import { Observable } from 'rxjs';
import { CommunityTopic } from 'libs/models/community';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';


@Component({
  selector: 'pf-community-filters',
  templateUrl: './community-filters.component.html',
  styleUrls: [ './community-filters.component.scss' ]
})
export class CommunityFiltersComponent implements OnInit {
  communityTopics$: Observable<CommunityTopic[]>;

  selectedTopics: any = [];

  constructor(public store: Store<fromCommunityTopicReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.communityTopics$ = this.store.select(fromCommunityTopicReducer.getTopics);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTopicActions.LoadingCommunityTopics());
  }

  filterPosts(filterId, placeHolderValue) {

    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.ChangingCommunityTopicFilterOptions
    (this.selectedTopics));

    this.setKendoMultiSelectPlaceholder(filterId, placeHolderValue);
  }

  setKendoMultiSelectPlaceholder(filterId, placeHolderValue) {
    const element = document.querySelector(`#${filterId} kendo-searchbar input`) as HTMLInputElement;
    setTimeout(function () {
      element.placeholder = `${placeHolderValue}`;
    }, 0);
  }

  isTopicSelected(itemId: string): boolean {
    return this.selectedTopics.some(item => item.Id === itemId);
  }
}



