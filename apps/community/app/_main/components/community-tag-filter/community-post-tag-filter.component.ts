import { Component } from '@angular/core';
import * as fromCommunityPostReducer from '../../reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

@Component({
  selector: 'pf-community-post-tag-filter',
  templateUrl: './community-post-tag-filter.component.html',
  styleUrls: ['./community-post-tag-filter.component.scss'],
})
export class CommunityPostTagFilterComponent {
  tagFilter$: Observable<string>;

  constructor(public store: Store<fromCommunityPostReducer.State>) {
    this.tagFilter$ = this.store.select(fromCommunityPostReducer.getCommunityPostsFilterTag);
  }

  removeTagFilter() {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPosts());
  }
}
