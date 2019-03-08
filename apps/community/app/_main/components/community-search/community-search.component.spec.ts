import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunitySearchComponent } from './community-search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CommunitySearchComponent', () => {
  let component: CommunitySearchComponent;
  let fixture: ComponentFixture<CommunitySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySearchComponent ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show community search component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
