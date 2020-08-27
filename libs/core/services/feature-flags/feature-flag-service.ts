import { BehaviorSubject } from 'rxjs';

/**
 * Represents a feature key(s) changed value
 */
export interface FeatureFlagChange {
  [key: string]: boolean;
}

/**
 * Represents a user attribute to pass to the feature service
 */
export interface FeatureFlagContextAttribute {
  [key: string]: any;
}

/**
 * Represents the user context to the feature service
 *
 * @property key The unique user identifier
 * @property [attributes] An optional object of attributes to pass to the feature service, usually for targeting.
 */
export interface FeatureFlagContext {
  key: number;
  attributes?: FeatureFlagContextAttribute;
}

/**
 * Represents a feature flagging service
 *
 * @property initialize a void function that will take in the context of the feature user and optionally a set of
 * initialFlags so that if the vendor supports it, can bootstrap the SDK so we do no need to wait until it is ready
 * @property enabled returns if the feature key is enabled, optionally the context can be sent again
 * @property [featureFlagChanged] optional property to allow consumers to be notified of changes to feature flags
 */
export interface FeatureFlagService {
  featureFlagChanged?: BehaviorSubject<FeatureFlagChange>;
  initialize(context: FeatureFlagContext, initialFlags?: any): void;
  enabled(key: string, context?: FeatureFlagContext): boolean;
}

/**
 * Abstract feature flagging service. Primarily for use as a provider token
 */
export abstract class AbstractFeatureFlagService implements FeatureFlagService {
  featureFlagChanged: BehaviorSubject<FeatureFlagChange>;

  abstract initialize(context: FeatureFlagContext, initialFlags?: any): void;
  abstract enabled(key: string, context?: FeatureFlagContext): boolean;
}
