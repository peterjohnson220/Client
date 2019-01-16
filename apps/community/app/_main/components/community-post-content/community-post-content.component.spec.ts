import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

import { NewLinePipe } from 'libs/core/pipes/new-line.pipe';
import { CommunityPostContentComponent } from './community-post-content.component';


describe('CommunityPostContentComponent', () => {
  let fixture: ComponentFixture<CommunityPostContentComponent>;
  let instance: CommunityPostContentComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxLinkifyjsModule.forRoot()
      ],
      providers: [
      ],
      declarations: [
        CommunityPostContentComponent,
        NewLinePipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(CommunityPostContentComponent);
    instance = fixture.componentInstance;
  }));

  it('should show community post content', () => {
    instance.content = 'test';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  it('should emit tag clicked on tagClicked', () => {
    const tag = '#tag';
    instance.hashTagClicked.subscribe(g => {
      expect(g).toEqual(tag);
    });
    instance.tagClicked(tag);
  });
});
