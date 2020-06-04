import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

import { PfLinkifyService } from '../../services/pf-linkify-service';
import * as fromRootState from 'libs/state/state';

import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityTagActions from '../../actions/community-tag.actions';
import { generateMockCommunityTag, generateMockCommunityLink } from 'libs/models/community';

import { CommunityTextAreaComponent } from './community-text-area.component';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';

describe('CommunityTextAreaComponent', () => {
  let fixture: ComponentFixture<CommunityTextAreaComponent>;
  let instance: CommunityTextAreaComponent;
  let store: Store<fromCommunityTagReducer.State>;
  let pfLinkifyService: PfLinkifyService;

  const event = { preventDefault: () => {} };
  const arrowDown = { key: 'ArrowDown', preventDefault: () => {} };
  const arrowUp = { key: 'ArrowUp', preventDefault: () => {} };
  const keyUp = {
      target: {
        selectionStart: 1
      },
      preventDefault: () => {}
    };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityTags: combineReducers(fromCommunityTagReducer.reducers),

        }),
        NgxLinkifyjsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: CommunityTagApiService,
          useValue: { validateNewCompanyName: jest.fn() }
        },
        {
          provide: PfLinkifyService,
          useValue: { getLinks: jest.fn() }
        }
      ],
      declarations: [
        CommunityTextAreaComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    pfLinkifyService = TestBed.get(PfLinkifyService);

    fixture = TestBed.createComponent(CommunityTextAreaComponent);
    instance = fixture.componentInstance;

    instance.parentForm = new FormBuilder().group({
       content:   ['']
     });
  });

  it('should show community text area', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should on arrow key down should set the selected tag', () => {

    const tag = generateMockCommunityTag();

    instance.suggestedTags = [];
    instance.suggestedTags.push(tag);
    instance.suggestedTags.push(tag);

    instance.onKeyDown(arrowDown);

    expect(instance.suggestedTags[0].IsSuggested).toEqual(true);
  });

  it('should on arrow key down should set the selected tag when there are multiple tags', () => {

    const tag = generateMockCommunityTag();
    tag.IsSuggested = true;

    const tag2 = generateMockCommunityTag();

    instance.suggestedTags = [];
    instance.suggestedTags.push(tag);
    instance.suggestedTags.push(tag2);

    instance.onKeyDown(arrowDown);

    expect(instance.suggestedTags[1].IsSuggested).toEqual(true);
  });

  it('should onKeyDown not invoke prevent default if suggested tags empty and container is not visible', () => {
    instance.suggestedTags = [];

    jest.spyOn(event, 'preventDefault');

    instance.onKeyDown(event);

    expect(event.preventDefault).toBeCalledTimes(0);
  });

  it('should onKeyDown not invoke prevent default if suggested tags has value but container is not visible', () => {
    const tag = generateMockCommunityTag();

    instance.suggestedTags.push(tag);
    jest.spyOn(event, 'preventDefault');
    instance.onKeyDown(event);
    expect(event.preventDefault).toBeCalledTimes(0);
  });
  it('should on arrow down it should prevent default', () => {

    const tag = generateMockCommunityTag();

    instance.suggestedTags = [];
    instance.suggestedTags.push(tag);

    jest.spyOn(arrowDown, 'preventDefault');
    instance.onKeyDown(arrowDown);
    expect(arrowDown.preventDefault).toHaveBeenCalled();
  });
  it('should on arrow key up set suggested tag', () => {

    const tag = generateMockCommunityTag();

    instance.suggestedTags.push(tag);

    instance.onKeyDown(arrowUp);
    expect(instance.suggestedTags[0].IsSuggested).toEqual(true);
  });
  it('should on arrow key up set suggested tag when multiple tags', () => {

    const tag1 = generateMockCommunityTag();
    tag1.IsSuggested = false;

    const tag2 = generateMockCommunityTag();
    tag2.IsSuggested = true;

    instance.suggestedTags = [];
    instance.suggestedTags.push(tag1);
    instance.suggestedTags.push(tag2);

    instance.onKeyDown(arrowUp);

    expect(instance.suggestedTags[0].IsSuggested).toEqual(true);
    expect(instance.suggestedTags[1].IsSuggested).toEqual(false);
  });

  it('should when selecting tag empty out suggestions', () => {
    const tag = generateMockCommunityTag();

    instance.onSuggestedTagChange(tag);
    expect(instance.suggestedTags).toEqual([]);
  });
  it('should on key up empty tag suggestions ', () => {
    instance.content.setValue('');
    fixture.detectChanges();

    instance.onKeyUp(keyUp);
    expect(instance.suggestedTags).toEqual([]);
  });
  it('should on key up get suggested matches ', () => {

    const postId = '12345';
    const input = '#t';
    const matches = ['#t'];
    const action = new fromCommunityTagActions.SuggestingCommunityTags({query: matches[0]});

    instance.getMatches = jest.fn().mockReturnValue(matches);

    instance.content.setValue(input);
    fixture.detectChanges();

    instance.onKeyUp(keyUp);
    expect(instance.suggestedTags).toEqual([]);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
  it('should getMatches return empty array when slice of text empty ', () => {
    const text = '';

    const result = instance.getMatches(text);

    expect(result).toEqual([]);
  });
  it('should getMatches return array of matches when slice of text has hashtag ', () => {
    const text = '#t';
    const matches = ['#t'];
    const match = generateMockCommunityLink();
    const ret = [];
    ret.push(match);

    pfLinkifyService.getLinks = jest.fn().mockReturnValue(ret);

    const result = instance.getMatches(text);

    expect(result).toEqual(matches);
  });
  it('should not call autogrow when the offset of text area with is 0', () => {

    instance.hasTextareaOffsetWidth = jest.fn().mockReturnValue(false);
    instance.autogrow = jest.fn();

    fixture.detectChanges();

    instance.onResize(event);
    fixture.detectChanges();

    expect(instance.autogrow).toHaveBeenCalledTimes(0);
  });
  it('should not call autogrow when the offset with of text area is greater than 0', () => {

    instance.hasTextareaOffsetWidth = jest.fn().mockReturnValue(true);
    instance.autogrow = jest.fn();

    fixture.detectChanges();

    instance.onResize(event);
    fixture.detectChanges();

    expect(instance.autogrow).toHaveBeenCalledTimes(1);
  });
  it('should return false for  hasTextareaOffsetWidth with offset zero ', () => {

    const result = instance.hasTextareaOffsetWidth();

    expect(result).toBeFalsy();
  });
  it('should set text area height to the scroll height of the discussion text area', () => {

    const textAreaDebugElement: DebugElement  = fixture.debugElement.query(By.css('.textAreaContainer'));
    const textAreaElement: HTMLElement = textAreaDebugElement.nativeElement;

    const discussionTextAreaDebugElement: DebugElement  = fixture.debugElement.query(By.css('.discussionTextArea'));
    const discussionTextArea: HTMLElement = discussionTextAreaDebugElement.nativeElement;

    instance.autogrow();

    fixture.detectChanges();

    expect(textAreaElement.style.height).toEqual(`${discussionTextArea.scrollHeight}px`);
  });
  it('should equal suggested tags on click out', () => {
    const match = generateMockCommunityLink();
    const tags = [];
    tags.push(match);

    instance.suggestedTags = tags;
    instance.clickout(event);

    expect(instance.suggestedTags).toEqual(tags);
  });
});


