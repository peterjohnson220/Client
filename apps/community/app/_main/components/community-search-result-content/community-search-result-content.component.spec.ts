import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CommunitySearchResultContentComponent } from './community-search-result-content.component';
import { TruncateAfterPipe, NewLinePipe } from 'libs/core/pipes';
import { CommunityLinkifyPipe } from '../../pipes/community-linkify.pipe';
import { CommunityHighlightTextPipe } from '../../pipes/community-highlight-search.pipe';


describe('CommunitySearchResultContentComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultContentComponent>;
  let instance: CommunitySearchResultContentComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgxLinkifyjsModule.forRoot(), NgbTooltipModule],
      providers: [],
      declarations: [
        CommunitySearchResultContentComponent,
        NewLinePipe,
        TruncateAfterPipe,
        CommunityLinkifyPipe,
        CommunityHighlightTextPipe],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunitySearchResultContentComponent);

    instance = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should display', () => {

    instance.searchTerm = 'test';
    instance.details = {Content: 'test', Responses: null};
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
