import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityTagsReducer from '../../reducers';
import { CommunityPopularTagsComponent } from './community-popular-tags.component';


describe('CommunityPopularTagsComponent', () => {
  let component: CommunityPopularTagsComponent;
  let fixture: ComponentFixture<CommunityPopularTagsComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityTags: combineReducers(fromCommunityTagsReducer.reducers)
        })
      ],
      declarations: [ CommunityPopularTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPopularTagsComponent);

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    component = fixture.componentInstance;
  });

  it('should show popular tags', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
