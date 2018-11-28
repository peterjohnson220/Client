import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityTagActions from '../../actions/community-tag.actions';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';

import { CommunityTag } from 'libs/models/community';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';

@Component({
  selector: 'pf-community-popular-tags',
  templateUrl: './community-popular-tags.component.html',
  styleUrls: ['./community-popular-tags.component.scss']
})
export class CommunityPopularTagsComponent implements OnInit {
  popularTags$: Observable<CommunityTag[]>;
  filteredByPost$: Observable<boolean>;


  constructor(public store: Store<fromCommunityTagReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.popularTags$ = this.store.select(fromCommunityTagReducer.getLoadingCommunityPopularTagsSuccess);
    this.filteredByPost$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTagActions.LoadingCommunityPopularTags());
  }

  buttonClicked(popularTag: CommunityTag) {
    const tag = mapCommunityTagToTag(popularTag);
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(tag));
  }
}
