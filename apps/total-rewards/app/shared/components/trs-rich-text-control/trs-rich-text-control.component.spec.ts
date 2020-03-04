import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsRichTextControlComponent } from './trs-rich-text-control.component';

describe('TrsRichTextControlComponent', () => {
  let component: TrsRichTextControlComponent;
  let fixture: ComponentFixture<TrsRichTextControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsRichTextControlComponent ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsRichTextControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.sectionTitlesStyles = {} as any;
    component.dataStyles = {} as any;
    component.controlData = {} as any;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
