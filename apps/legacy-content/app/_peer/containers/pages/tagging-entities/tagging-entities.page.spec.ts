import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { SaveTagInformationRequest, TagInformationRequest } from 'libs/models/peer/requests';
import { generateMockTag, generateMockTagInformation, TagEntityTypeEnum } from 'libs/models/peer';

import * as fromTaggingEntitiesReducer from '../../../reducers';
import * as fromTaggingEntitiesActions from '../../../actions/tagging-entities.actions';
import { TaggingEntitiesPageComponent } from './tagging-entities.page';


describe('Legacy Content - Tags - Tagging Entities', () => {
  let fixture: ComponentFixture<TaggingEntitiesPageComponent>;
  let instance: TaggingEntitiesPageComponent;
  let activatedRoute: ActivatedRoute;
  let store: Store<fromRootState.State>;
  let routeIdParam: number;
  let routeEtParam: string;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          legacy_taggingEntities: combineReducers(fromTaggingEntitiesReducer.reducers)
        })
      ],
      declarations: [
        TaggingEntitiesPageComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { id : 1, et: 'Company' } } }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.queryParams.id;
    routeEtParam = activatedRoute.snapshot.queryParams.et;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TaggingEntitiesPageComponent);
    instance = fixture.componentInstance;
    instance.entityId = routeIdParam;
    instance.entityType = routeEtParam as TagEntityTypeEnum;
  });

  it('should match snapshot of page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadTagInformation action when loadTagInformation is called', () => {
    const payload: TagInformationRequest = {
      EntityType: instance.entityType,
      EntityId: instance.entityId
    };
    const expectedAction = (new fromTaggingEntitiesActions.LoadTagInformation(payload));

    fixture.detectChanges();
    instance.loadTagInformation();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an AddTag action when onValueChange is called', () => {
    const value = [ generateMockTag() ];
    const expectedAction = (new fromTaggingEntitiesActions.AddTag(value[0]));

    fixture.detectChanges();
    instance.onValueChange(value, 1);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a RemoveTag action when onRemoveTag is called', () => {
    const value = {
      dataItem: generateMockTag()
    };
    const expectedAction = (new fromTaggingEntitiesActions.RemoveTag(value.dataItem));

    fixture.detectChanges();
    instance.onRemoveTag(value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a SaveTagInformation action when saveTagInformation is called', () => {
    instance.addedTags = [ generateMockTag() ];
    instance.removedTags = [ generateMockTag() ];
    const payload: SaveTagInformationRequest = {
      EntityType: instance.entityType,
      EntityId: instance.entityId,
      AddedTags: instance.addedTags,
      RemovedTags: instance.removedTags
    };
    const expectedAction = (new fromTaggingEntitiesActions.SaveTagInformation(payload));

    fixture.detectChanges();
    instance.saveTagInformation();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a CloseTaggingEntitiesModal action when closeModal is called', () => {
    const expectedAction = (new fromTaggingEntitiesActions.CloseTaggingEntitiesModal());

    fixture.detectChanges();
    instance.closeModal();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('saveDisabled should be true if there are no entries in added and/or removed tag arrays', () => {
    fixture.detectChanges();
    instance.updateSaveButton();

    expect(instance.saveDisabled).toBeTruthy();
  });

  it('saveDisabled should be false if there are entries in added and/or removed tag arrays', () => {
    instance.addedTags = [ generateMockTag() ];
    instance.removedTags = [ generateMockTag() ];

    fixture.detectChanges();
    instance.updateSaveButton();

    expect(instance.saveDisabled).toBeFalsy();
  });

  it('viewMore should turn true if false and link should be view less', () => {
    instance.viewMore = false;

    fixture.detectChanges();
    instance.updateViewMore();

    expect(instance.viewMore).toBeTruthy();
    expect(instance.viewMoreLinkText).toBe('View Less');
  });

  it('viewMore should turn false if true and link should be view more', () => {
    instance.viewMore = true;
    instance.tagInformation = [ generateMockTagInformation() ];
    instance.priorityCategories = [ generateMockTagInformation() ];
    instance.regularCategories = [ generateMockTagInformation() ];

    fixture.detectChanges();
    instance.updateViewMore();

    expect(instance.viewMore).toBeFalsy();
    expect(instance.viewMoreLinkText).toBe('View More');
  });
});
