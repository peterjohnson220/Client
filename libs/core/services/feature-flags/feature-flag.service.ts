import { Subject } from 'rxjs';

/**
 * @deprecated Implementation ongoing, do not use yet.
 *
 * Represents a real time feature flag
 */
export interface RealTimeFlag {
  key: string;
  value: boolean;
}

/**
 * @deprecated Implementation ongoing, do not use yet.
 *
 * Represents a feature key(s) changed value
 */
export interface FeatureFlagChange {
  [key: string]: boolean;
}

/**
 * @deprecated Implementation ongoing, do not use yet.
 *
 * Represents a user attribute to pass to the feature service
 */
export interface FeatureFlagContextAttribute {
  [key: string]: any;
}

/**
 * @deprecated Implementation ongoing, do not use yet.
 *
 * Represents the user context to the feature service
 *
 * @property key The unique user identifier
 * @property [attributes] An optional object of attributes to pass to the feature service, usually for targeting.
 */
export interface FeatureFlagContext {
  key: number;
  email?: string;
  attributes?: FeatureFlagContextAttribute;
}

/**
 * @deprecated Implementation ongoing, do not use yet.
 *
 * Represents a feature flagging service
 *
 * @property initialize a void function that will take in the context of the feature user and optionally a set of
 * initialFlags so that if the vendor supports it, can bootstrap the SDK so we do no need to wait until it is ready
 * @property enabled returns if the feature key is enabled, optionally the context can be sent again
 * @property bindEnabled a void function that will take in a RealTimeFlag object and update its flag value whenever the
 * feature flag changes. An unsubscribe subject is required to tell the service when to stop subscribing to changes.
 */
export interface FeatureFlagService {
  initialize(sdkKey: string, context: FeatureFlagContext, initialFlags?: any): void;
  enabled(key: string, defaultValue?: boolean, context?: FeatureFlagContext): boolean;
  bindEnabled(flag: RealTimeFlag, unSubscribe: Subject<void>): void;
}

/**
 * @deprecated Implementation ongoing, do not use yet.
 *
 * Abstract feature flagging service. Primarily for use as a provider token
 */
export abstract class AbstractFeatureFlagService implements FeatureFlagService {
  abstract initialize(sdkKey: string, context: FeatureFlagContext, initialFlags?: any): void;
  abstract enabled(key: string, defaultValue?: boolean, context?: FeatureFlagContext): boolean;
  abstract bindEnabled(flag: RealTimeFlag, unSubscribe: Subject<void>): void;
}
