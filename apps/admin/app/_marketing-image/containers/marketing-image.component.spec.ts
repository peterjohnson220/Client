import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingImageComponent } from './marketing-image.component';

describe('MarketingImageComponent', () => {
  let component: MarketingImageComponent;
  let fixture: ComponentFixture<MarketingImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
