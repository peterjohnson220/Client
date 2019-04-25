import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

import { CommunitySearchResultContentComponent } from './community-search-result-content.component';
import { TruncateAfterPipe, NewLinePipe } from 'libs/core/pipes';


describe('CommunitySearchResultContentComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultContentComponent>;
  let instance: CommunitySearchResultContentComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgxLinkifyjsModule.forRoot() ],
      providers: [],
      declarations: [
        CommunitySearchResultContentComponent,
        NewLinePipe,
        TruncateAfterPipe],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunitySearchResultContentComponent);
    instance = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should display content', () => {
    instance.content = 'test content';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
