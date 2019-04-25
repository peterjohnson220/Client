import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySearchResultHeaderComponent } from './community-search-result-header.component';


describe('CommunitySearchResultHeaderComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultHeaderComponent>;
  let instance: CommunitySearchResultHeaderComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySearchResultHeaderComponent ]
    });

   fixture = TestBed.createComponent(CommunitySearchResultHeaderComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });


  it('should display company name and elapsed time', () => {
    instance.companyName = 'test company';
    instance.elapsedTime = '2 days ago';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
