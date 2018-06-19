import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MarketingImageComponent } from '.';

describe('MarketingComponent', () => {
  let component: MarketingImageComponent;
  let fixture: ComponentFixture<MarketingImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  ReactiveFormsModule ],
      declarations: [ MarketingImageComponent ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should NOT show the preview image, when previewFileUri is empty', () => {
    component.previewFileUri = '';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the preview image, when previewFileUri is NOT empty', () => {
    component.previewFileUri = 'test';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should NOT show error message, when errorMessage is empty', () => {
    component.errorMessage = '';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show error message, when errorMessage is NOT empty', () => {
    component.errorMessage = 'test';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
