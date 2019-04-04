import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { JobDescriptionParserPipe } from 'libs/core/pipes';

import { GridDetailPanelComponent } from './grid-detail-panel.component';

describe('GridDetailPanelComponent', () => {
  let component: GridDetailPanelComponent;
  let fixture: ComponentFixture<GridDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDetailPanelComponent, JobDescriptionParserPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input props', () => {
    component.jobId = 123;
    component.jobCode = 'jobCode';
    component.jobFamily = 'jobFamily';
    component.jobDescription = 'jobDescription';
    component.jobExchange = 'jobExchange';

    expect(fixture).toMatchSnapshot();
  });

  it('should render a falsy job family as No Family', () => {
    component.jobFamily = '';
    expect(fixture).toMatchSnapshot();
  });

  it('should emit when the close link is clicked', () => {
    spyOn(component.closeClick, 'emit');

    component.isExpanded$ = of(true);

    const clearSelections = fixture.debugElement.nativeElement.querySelector('a.close-detail');
    clearSelections.click();

    expect(component.closeClick.emit).toHaveBeenCalled();
  });
});
