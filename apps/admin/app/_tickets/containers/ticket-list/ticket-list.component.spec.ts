import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListComponent } from './ticket-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListComponent ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
