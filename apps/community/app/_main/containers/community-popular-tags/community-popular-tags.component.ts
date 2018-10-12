import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityTagActions from '../../actions/community-tag.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityTagReducer from '../../reducers';
import { CommunityTag } from 'libs/models/community';


@Component({
  selector: 'pf-community-popular-tags',
  templateUrl: './community-popular-tags.component.html',
  styleUrls: ['./community-popular-tags.component.scss']
})
export class CommunityPopularTagsComponent implements OnInit {
  popularTags$: Observable<CommunityTag[]>;

  constructor(public store: Store<fromCommunityTagReducer.State>) {
    this.popularTags$ = this.store.select(fromCommunityTagReducer.getLoadingCommunityPopularTagsSuccess);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityTagActions.LoadingCommunityPopularTags());
  }

  filterDiscussionByTag(tag) {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPostsByTag({tag: tag}));
  }

}
