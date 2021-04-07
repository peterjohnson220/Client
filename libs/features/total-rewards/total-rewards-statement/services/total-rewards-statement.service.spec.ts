import { TotalRewardsStatementService } from './total-rewards-statement.service';
import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';

describe('TotalRewardsStatementService', () => {
  it('getUdfAsNumeric should return numbers verbatim', () => {
    // arrange
    const employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: 12345 } } as any;

    // act
    const udfValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, 'EmployeesUdf', 'UDF_CHAR_1');

    // assert
    expect(udfValue).toBe(12345);
  });

  it('getUdfAsNumeric should return a number when the field value is a number as a string', () => {
    // arrange
    const employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: `12345` } } as any;

    // act
    const udfValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, 'EmployeesUdf', 'UDF_CHAR_1');

    // assert
    expect(udfValue).toBe(12345);
  });

  it('getUdfAsNumeric should return a number when the field value is a number as a string starting with a `$`', () => {
    // arrange
    const employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: `$12345` } } as any;

    // act
    const udfValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, 'EmployeesUdf', 'UDF_CHAR_1');

    // assert
    expect(udfValue).toBe(12345);
  });

  it('getUdfAsNumeric should return a number when the field value is a number as a string containing commas', () => {
    // arrange
    const employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: `12,345` } } as any;

    // act
    const udfValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, 'EmployeesUdf', 'UDF_CHAR_1');

    // assert
    expect(udfValue).toBe(12345);
  });

  it('getUdfAsNumeric should return a number when the field value is a number as a string containing a decimal', () => {
    // arrange
    const employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: `123.45` } } as any;

    // act
    const udfValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, 'EmployeesUdf', 'UDF_CHAR_1');

    // assert
    expect(udfValue).toBe(123.45);
  });

  it('getUdfAsNumeric should return NaN when the field value is a string that cannot be coerced to a number', () => {
    // arrange
    const employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: `not a number` } } as any;

    // act
    const udfValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, 'EmployeesUdf', 'UDF_CHAR_1');

    // assert
    expect(udfValue).toBe(NaN);
  });
});
