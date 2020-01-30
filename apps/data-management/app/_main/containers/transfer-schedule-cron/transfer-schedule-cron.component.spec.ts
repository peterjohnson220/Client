import {SimpleChange} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/compiler/src/core';

import { TransferScheduleCronComponent } from './transfer-schedule-cron.component';

describe('TransferScheduleCronComponent', () => {
  let component: TransferScheduleCronComponent;
  let fixture: ComponentFixture<TransferScheduleCronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferScheduleCronComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferScheduleCronComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have a good default state if no expression is passed', () => {
    fixture.detectChanges();

    expect(component.dailyChecked).toBe(false);
    expect(component.weeklyChecked).toBe(false);
    expect(component.monthlyChecked).toBe(false);

    expect(fixture).toMatchSnapshot();
  });

  it('should have a good default state if a daily expression is passed', () => {
    component.id = 1;
    component.cronExpression = '0 0 * * *';
    component.ngOnChanges({cronExpression: new SimpleChange(null, component.cronExpression, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(component.dailyChecked).toBe(true);
    expect(component.weeklyChecked).toBe(false);
    expect(component.monthlyChecked).toBe(false);

    expect(fixture).toMatchSnapshot();
  });

  it('should have a good default state if a weekly expression is passed', () => {
    component.id = 1;
    component.cronExpression = '0 0 * * 2';
    component.ngOnChanges({cronExpression: new SimpleChange(null, component.cronExpression, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(component.dailyChecked).toBe(false);
    expect(component.weeklyChecked).toBe(true);
    expect(component.monthlyChecked).toBe(false);
    expect(component.dayValue).toBe('2');
    expect(component.defaultDay.value).toBe('2');

    expect(fixture).toMatchSnapshot();
  });

  it('should have a good default state if a monthly expression is passed', () => {
    component.id = 1;
    component.cronExpression = '0 0 * * 1#2';
    component.ngOnChanges({cronExpression: new SimpleChange(null, component.cronExpression, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(component.dailyChecked).toBe(false);
    expect(component.weeklyChecked).toBe(false);
    expect(component.monthlyChecked).toBe(true);
    expect(component.monthlyDayValue).toBe('1');
    expect(component.monthlyWeekOfMonthValue).toBe('2');

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a daily cron expression when daily button is clicked', () => {
    spyOn(component.cronExpressionChanges, 'emit');

    component.setDaily();
    expect(component.dailyChecked).toBe(true);
    expect(component.weeklyChecked).toBe(false);
    expect(component.monthlyChecked).toBe(false);

    expect(component.cronExpressionChanges.emit).toHaveBeenNthCalledWith(1, { expression: '0 0 * * *', force: false});
  });

  it('should emit an incomplete cron expression when weekly button is clicked and no selection made', () => {
    spyOn(component.cronExpressionChanges, 'emit');

    component.setWeekly();
    expect(component.dailyChecked).toBe(false);
    expect(component.weeklyChecked).toBe(true);
    expect(component.monthlyChecked).toBe(false);

    expect(component.cronExpressionChanges.emit).toHaveBeenNthCalledWith(1, { expression: '0 0 * * ', force: false});
  });

  it('should emit a weekly cron expression when weekly button is clicked and selection made', () => {
    spyOn(component.cronExpressionChanges, 'emit');

    component.setWeekly();
    component.dayOfWeekChange({ text: 'Tuesday', value: '2'});
    expect(component.dailyChecked).toBe(false);
    expect(component.weeklyChecked).toBe(true);
    expect(component.monthlyChecked).toBe(false);
    expect(component.dayValue).toBe('2');

    expect(component.cronExpressionChanges.emit).toHaveBeenNthCalledWith(1, { expression: '0 0 * * ', force: false});
    expect(component.cronExpressionChanges.emit).toHaveBeenNthCalledWith(2, { expression: '0 0 * * 2', force: false });
  });

  it('should emit a monthly cron expression when monthly fields are passed', () => {
    spyOn(component.cronExpressionChanges, 'emit');

    component.setMonthly();
    component.weekOfMonthChange({ text: '2nd', value: '2'});
    component.dayOfMonthChange({ text: 'Monday', value: '1'});
    expect(component.dailyChecked).toBe(false);
    expect(component.weeklyChecked).toBe(false);
    expect(component.monthlyChecked).toBe(true);

    expect(component.cronExpressionChanges.emit).toHaveBeenNthCalledWith(1, {expression: '0 0 * * 1#1', force: false });
    expect(component.cronExpressionChanges.emit).toHaveBeenNthCalledWith(2, {expression: '0 0 * * 1#2', force: false });
  });

  it('should call setDaily when handle click has a daily interval', () => {
    spyOn(component, 'setDaily');

    component.handleClick('daily');
    expect(component.setDaily).toHaveBeenCalled();
  });

  it('should call setWeekly when handle click has a weekly interval', () => {
    spyOn(component, 'setWeekly');

    component.handleClick('weekly');
    expect(component.setWeekly).toHaveBeenCalled();
  });

  it('should call setMonthly when handle click has a weekly interval', () => {
    spyOn(component, 'setMonthly');

    component.handleClick('monthly');
    expect(component.setMonthly).toHaveBeenCalled();
  });

  it('should create a new cron expression if empty expression is passed', () => {
    spyOn(component, 'createNewCronExpression');

    component.ngOnChanges({cronExpression: new SimpleChange(null, null, true)});

    expect(component.createNewCronExpression).toHaveBeenCalled();
  });

  it('should create a new cron expression if invalid expression is passed', () => {
    spyOn(component, 'createNewCronExpression');

    component.ngOnChanges({cronExpression: new SimpleChange(null, '* * * *', true)});

    expect(component.createNewCronExpression).toHaveBeenCalled();
  });
});
