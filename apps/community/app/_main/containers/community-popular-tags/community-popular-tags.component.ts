import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityTagActions from '../../actions/community-tag.actions';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';

import { CommunityTag } from 'libs/models/community';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';
import { FilterOptions } from 'apps/community/app/_main/models/filter-options.model';
import { Tag } from '../../models';

@Component({
  selector: 'pf-community-popular-tags',
  templateUrl: './community-popular-tags.component.html',
  styleUrls: ['./community-popular-tags.component.scss']
})
export class CommunityPopularTagsComponent implements OnInit, OnDestroy {
  popularTags$: Observable<CommunityTag[]>;
  filteredByPost$: Observable<boolean>;
  filters$: Observable<FilterOptions>;
  filterOptionsSubscription: Subscription;
  filteredTags: Tag[];

  constructor(public store: Store<fromCommunityTagReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>) {
    this.popularTags$ = this.store.select(fromCommunityTagReducer.getLoadingCommunityPopularTagsSuccess);
    this.filteredByPost$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
    this.filters$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTagActions.LoadingCommunityPopularTags());

    this.filterOptionsSubscription = this.filters$.subscribe((data) => {
        this.filteredTags = data.TagFilter.Tags;
    });
  }

  ngOnDestroy() {
    this.filterOptionsSubscription.unsubscribe();
  }

  buttonClicked(popularTag: CommunityTag) {
    const tag = mapCommunityTagToTag(popularTag);
    if ( ! this.IsTagSelected (popularTag)) {
      this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(tag));
    } else {
      this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(tag));
    }
  }

  private IsTagSelected(tag: CommunityTag): boolean {
    return this.filteredTags.some (x => x.Id === tag.Id);
  }

}
