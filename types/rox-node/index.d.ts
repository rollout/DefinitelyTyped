// Type definitions for rox-browser 5.0
// Project: https://rollout.io
// Definitions by: g-guirado <https://github.com/g-guirado>
//                 rollout: <https://github.com/rollout>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/**
 *
 * Official documentation for rox-node is available here:
 * https://support.rollout.io/docs/nodejs-api
 *
 */

export interface RoxContainer {
  [key: string]: Flag | RoxNumber | RoxString;
}

/**
 * The register function should be called before the call to Rox.setup()
 *
 * https://support.rollout.io/docs/nodejs-api#section-register
 */
export function register(namespace: string, roxContainer: RoxContainer): void;

export function register(roxContainer: RoxContainer): void;

/**
 * Set Global Context.
 * You can think of Global Context as a default context
 *
 * https://support.rollout.io/docs/nodejs-api#section-setcontext
 */
export function setContext(globalContext: unknown): void;

/**
 * Initiate connection with Rox servers for the application identified by the application key.
 * The registered containers will be synced and Rox entities will get the appropriate values.
 *
 * https://support.rollout.io/docs/nodejs-api#section-setup
 */
export function setup(apiKey: string, options?: RoxSetupOptions): Promise<unknown>;

export interface RoxSetupOptions {
  version?: string;
  // https://support.rollout.io/docs/configuration-fetched-handler
  configurationFetchedHandler?(fetcherResult: RoxFetcherResult): void;
  debugLevel?: 'verbose';
  // https://support.rollout.io/docs/nodejs-api#section-using-the-impressionhandler-option
  impressionHandler?(reporting: RoxReporting, context: unknown): void;
  platform?: string;
  fetchIntervalInSec?: number;
  disableNetworkFetch?: boolean;
  devModeSecret?: string;
  // https://support.rollout.io/docs/javascript-browser-api#section-dynamicPropertyRuleHandler
  dynamicPropertyRuleHandler?(propName: string, context: any): any;
}

export enum RoxFetcherStatus {
  AppliedFromEmbedded = 'APPLIED_FROM_EMBEDDED',
  AppliedFromCache = 'APPLIED_FROM_CACHE',
  AppliedFromNetwork = 'APPLIED_FROM_NETWORK',
  ErrorFetchFailed = 'ERROR_FETCH_FAILED'
}

export enum RoxErrorTrigger {
  DYNAMIC_PROPERTIES_RULE = 'DYNAMIC_PROPERTIES_RULE',
  CONFIGURATION_FETCHED_HANDLER = 'CONFIGURATION_FETCHED_HANDLER',
  IMPRESSION_HANDLER = 'IMPRESSION_HANDLER',
  CUSTOM_PROPERTY_GENERATOR = 'CUSTOM_PROPERTY_GENERATOR'
}

export interface RoxFetcherResult {
  fetcherStatus: RoxFetcherStatus;
  creationDate: Date;
  hasChanges: boolean;
  errorDetails?: string;
}

export interface RoxReporting {
  name: string;
  value: string;
  targeting: boolean;
}

/**
 * https://support.rollout.io/docs/custom-properties
 */
export function setCustomNumberProperty(name: string, value: number | ((context?: unknown) => number)): void;
export function setCustomStringProperty(name: string, value: string | ((context?: unknown) => string)): void;
export function setCustomBooleanProperty(name: string, value: boolean | ((context?: unknown) => boolean)): void;

// https://support.rollout.io/docs/user-space-error-handler
export function setUserspaceUnhandledErrorHandler(
  handler: (errorTrigger: RoxErrorTrigger, error: Error) => void
): void;

/**
 * Pulls the latest configuration and flag values down from the Rollout servers
 *
 * https://support.rollout.io/docs/nodejs-api#section-fetch
 */
export function fetch(): void;

/**
 * Creates a new Flag
 * https://support.rollout.io/docs/nodejs-api#section--flag-
 */
export class Flag {
  constructor(defaultValue?: boolean);

  // The name of the Flag
  readonly name: string;

  // Default value of the Flag
  readonly defaultValue: boolean;

  // Returns true when the flag is enabled
  isEnabled(context?: unknown): boolean;
}

/**
 * Used to create and manage Rollout feature flags that determine different predefined string values
 *
 * https://support.rollout.io/docs/nodejs-api#section--rox-string-
 */
export class RoxString {
  constructor(defaultValue: string, options?: ReadonlyArray<string>);

  // The name of the Variant
  readonly name: string;

  // Default value of the Variant
  readonly defaultValue: string;

  // Returns the current value of the Variant, accounting for value overrides
  getValue(context?: unknown): string;
}

/**
 * Used to create and manage Rollout feature flags that determine different predefined number values
 *
 * https://support.rollout.io/docs/nodejs-api#section--rox-number-
 */
export class RoxNumber {
  constructor(defaultValue: number, options?: ReadonlyArray<number>);

  // The name of the RoxNumber
  readonly name: string;

  // Default value of the RoxNumber
  readonly defaultValue: number;

  // Returns the current value of the RoxNumber, accounting for value overrides
  getValue(context?: unknown): number;
}

/**
 * Override: Should only be used for development purposes (QA - Feature dev - e2e)
 *
 * When you override an existing flag value using the Rox.overrides.setOverride method,
 * the SDK will disregard existing configuration coming from the dashboard and will
 * serialize the override on disk this value will be loaded and override the flag
 * right after you call Rox.setup. To clear the override from the cache you need to
 * call the Rox.overrides.clearOverride method.
 *
 * One can refer to the javascript-browser-api for this feature:
 * https://support.rollout.io/docs/javascript-browser-api#section--rox-overrides-
 */
export namespace overrides {
  /**
   * Sets an override value on a specific flag, this function accepts two parameters flag name (
   * full flag name including namespace) and desired value (from type String).
   * This function also saves the override value on the local device disk,
   * so it is "remembered" for the next the SDK is loaded to production.
   *
   * https://support.rollout.io/docs/javascript-browser-api#section--rox-overrides-setoverride-
   *
   * Note that for boolean flag we still give the value as a string.
   */
  function setOverride(nameSpacedFlagName: string, value: string): void;

  /**
   * Clears the override value from the flag (and the disk).
   *
   * https://support.rollout.io/docs/javascript-browser-api#section--rox-overrides-clearoverride-
   */
  function clearOverride(nameSpacedFlagName: string): void;

  /**
   * Clears all override values
   */
  function clearAllOverrides(): void;

  function getOriginalValue(nameSpacedFlagName: string): string;

  /**
   * full flag name including namespace
   *
   * https://support.rollout.io/docs/javascript-browser-api#section--rox-overrides-hasoverride-
   */
  function hasOverride(nameSpacedFlagName: string): boolean;
}

/**
 * Dynamic API is an alternative to Rollout static API for defining flags on the
 * different container objects and accessing them from that container object.
 * https://support.rollout.io/docs/dynamic-api
 */
export namespace dynamicApi {
  /**
   * Getting boolean value of a flag
   */
  function isEnabled(nameSpacedFlagName: string, defaultValue: boolean, context?: unknown): boolean;

  /**
   * Getting string value of a string flag
   */
  function value(nameSpacedFlagName: string, defaultValue: string, context?: unknown): string;

  /**
   * Getting string value of a number flag
   */
  function getNumber(nameSpacedFlagName: string, defaultValue: number, context?: unknown): number;
}

export const flags: ReadonlyArray<Flag>;
