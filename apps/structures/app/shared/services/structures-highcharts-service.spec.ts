import { TestBed } from '@angular/core/testing';

import { StructuresHighchartsService } from './structures-highcharts-service';

describe('StructuresHighchartsService', () => {
  let service: StructuresHighchartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StructuresHighchartsService,
      ],
    });

    service = TestBed.inject(StructuresHighchartsService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('rounding should work as expected', () => {
    // arrange
    const testValue1 = 45.9352395;
    const testValue2 = 55550.93023924;
    const testValue3 = 69343.2569352;

    // act
    const roundedValue1 = StructuresHighchartsService.roundTo(testValue1, 2);
    const roundedValue2 = StructuresHighchartsService.roundTo(testValue2, 0);
    const roundedValue3 = StructuresHighchartsService.roundTo(testValue3, 4);

    // assert
    expect(roundedValue1).toEqual(45.94);
    expect(roundedValue2).toEqual(55551);
    expect(roundedValue3).toEqual(69343.2569);
  });

  it('regression values specify rate to determine rounding for y axis values', () => {
    // arrange
    const testSlope = -0.025691779971209527;
    const testIntercept = 11.104866961089076;
    const testAnnualRate = 'Annual';
    const testHourlyRate = 'Hourly';
    const testJobData = { 'CompanyStructures_Ranges_DispSeq' : 1 };

    // act
    const computedValueAnnual = StructuresHighchartsService.getRegressionDataPoint(1, testJobData, testSlope, testIntercept, testAnnualRate);
    const computedValueHourly = StructuresHighchartsService.getRegressionDataPoint(1, testJobData, testSlope, testIntercept, testHourlyRate);

    // assert
    expect(computedValueAnnual.y).toEqual(64807);
    expect(computedValueHourly.y).toEqual(64807.41);
  });


  it('regression values specify rate to determine rounding for y axis values', () => {
    // arrange
    const testSlope = -0.025691779971209527;
    const testIntercept = 11.104866961089076;
    const testAnnualRate = 'Annual';
    const testHourlyRate = 'Hourly';
    const testJobData = { 'CompanyStructures_Ranges_DispSeq' : 1 };

    // act
    const computedValueAnnual = StructuresHighchartsService.getRegressionDataPoint(1, testJobData, testSlope, testIntercept, testAnnualRate);
    const computedValueHourly = StructuresHighchartsService.getRegressionDataPoint(1, testJobData, testSlope, testIntercept, testHourlyRate);

    // assert
    expect(computedValueAnnual.y).toEqual(64807);
    expect(computedValueHourly.y).toEqual(64807.41);
  });

  it('ensure computed y axis values trend downwards with a negative slope', () => {
    // arrange
    const testSlope = -0.025691779971209527;
    const testIntercept = 11.104866961089076;
    const testAnnualRate = 'Annual';
    const testJobData1 = { 'CompanyStructures_Ranges_DispSeq' : 1 };
    const testJobData2 = { 'CompanyStructures_Ranges_DispSeq' : 2 };
    const testJobData3 = { 'CompanyStructures_Ranges_DispSeq' : 3 };

    // act
    const computedValue1 = StructuresHighchartsService.getRegressionDataPoint(1, testJobData1, testSlope, testIntercept, testAnnualRate);
    const computedValue2 = StructuresHighchartsService.getRegressionDataPoint(2, testJobData2, testSlope, testIntercept, testAnnualRate);
    const computedValue3 = StructuresHighchartsService.getRegressionDataPoint(3, testJobData3, testSlope, testIntercept, testAnnualRate);

    // assert
    expect(computedValue2.y).toBeLessThan(computedValue1.y);
    expect(computedValue3.y).toBeLessThan(computedValue2.y);

  });

  it('ensure computed y axis values trend upwards with a positive slope', () => {
    // arrange
    const testSlope = 0.03262528702622384;
    const testIntercept = 10.993124085900376;
    const testAnnualRate = 'Annual';
    const testJobData1 = { 'CompanyStructures_Ranges_DispSeq' : 1 };
    const testJobData2 = { 'CompanyStructures_Ranges_DispSeq' : 2 };
    const testJobData3 = { 'CompanyStructures_Ranges_DispSeq' : 3 };

    // act
    const computedValue1 = StructuresHighchartsService.getRegressionDataPoint(1, testJobData1, testSlope, testIntercept, testAnnualRate);
    const computedValue2 = StructuresHighchartsService.getRegressionDataPoint(2, testJobData2, testSlope, testIntercept, testAnnualRate);
    const computedValue3 = StructuresHighchartsService.getRegressionDataPoint(3, testJobData3, testSlope, testIntercept, testAnnualRate);

    // assert
    expect(computedValue2.y).toBeGreaterThan(computedValue1.y);
    expect(computedValue3.y).toBeGreaterThan(computedValue2.y);

  });

});
