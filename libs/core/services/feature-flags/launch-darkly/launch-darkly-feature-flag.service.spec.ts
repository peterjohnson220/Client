import * as LDClientSdk from 'launchdarkly-js-client-sdk';

import { LaunchDarklyFeatureFlagService } from './launch-darkly-feature-flag.service';

jest.mock('launchdarkly-js-client-sdk');

describe('Launch Darkly Feature Flag Service', () => {
  let service: LaunchDarklyFeatureFlagService;

  beforeEach(() => {
    service = new LaunchDarklyFeatureFlagService();
  });

  it('#enabled should return the default value when the client is not initialized', () => {
    // Act
    const enabledValue = service.enabled('test1', true);

    // Assert
    expect(enabledValue).toBe(true);
  });

  it('#initialize should do nothing when we have no SDK key', () => {
    // Arrange
    spyOn(LDClientSdk, 'initialize');

    // Act
    service.initialize('', { key: 123 });

    // Assert
    expect(LDClientSdk.initialize).not.toHaveBeenCalled();
  });

  // TODO [BC]: Figure out how to properly mock the LDClientSdk in Jest to add more tests
  // it('#initialize should parse the initial flags json object when provided', () => {
  //   // Arrange
  //   spyOn(LDClientSdk, 'initialize');
  //
  //   // Act
  //   service.initialize('SDK-123', { key: 123 }, JSON.stringify({ testFlag1: true}));
  //
  //   // Assert
  //   expect(LDClientSdk.initialize).not.toHaveBeenCalled();
  // });

});
