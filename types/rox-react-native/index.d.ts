// Type definitions for rox-browser 5.0
// Project: https://rollout.io
// Definitions by: ahanriat <https://github.com/ahanriat>
//                 g-guirado <https://github.com/g-guirado>
//                 glenna <https://github.com/glenna>
//                 rollout <https://github.com/rollout>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/**
 *
 * Official documentation for rox-react-native is available here:
 * https://support.rollout.io/docs/reactnative
 *
 */

export interface RoxContainer {
    [key: string]: Flag |  RoxNumber | RoxString;
}

/**
 * The register function should be called before the call to Rox.setup()
 *
 * https://support.rollout.io/docs/reactnative#section-register
 */
export function register(namespace: string, roxContainer: RoxContainer): void;

export function register(roxContainer: RoxContainer): void;

/**
 * Initiate connection with Rox servers for the application identified by the application key.
 * The registered containers will be synced and Rox entities will get the appropriate values.
 *
 * https://support.rollout.io/docs/reactnative#section-setup
 */
export function setup(
    apiKey: string,
    options?: RoxSetupOptions
): Promise<unknown>;

export interface RoxSetupOptions {
    version?: string;
    // https://support.rollout.io/docs/reactnative#section-configurationfetchedhandler
    configurationFetchedHandler?(fetcherResult: RoxFetcherResult): void;
    debugLevel?: 'verbose';
    // https://support.rollout.io/docs/reactnative#section-using-the-impressionhandler-option
    impressionHandler?(reporting: RoxReporting, context: unknown): void;
    platform?: string;
    freeze?: FreezeOptions;
    disableNetworkFetch?: boolean;
    devModeSecret?: string;
    // https://support.rollout.io/docs/reactnative#section--asyncstorage-
    AsyncStorage?: any; // AsyncStorage from 'react-native' package
    // https://support.rollout.io/docs/javascript-browser-api#section-dynamicPropertyRuleHandler
    dynamicPropertyRuleHandler?(propName: string, context: any): any;
}

export enum RoxFetcherStatus {
    AppliedFromEmbedded = 'APPLIED_FROM_EMBEDDED',
    AppliedFromCache = 'APPLIED_FROM_CACHE',
    AppliedFromNetwork = 'APPLIED_FROM_NETWORK',
    ErrorFetchFailed = 'ERROR_FETCH_FAILED',
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
 * Note that you might have to call unfreeze after setting custom properties such as email after login
 * https://support.rollout.io/docs/custom-properties
 */
export function setCustomNumberProperty(
    name: string,
    value: number | (() => number)
): void;
export function setCustomStringProperty(
    name: string,
    value: string | (() => string)
): void;
export function setCustomBooleanProperty(
    name: string,
    value: boolean | (() => boolean)
): void;

// https://support.rollout.io/docs/user-space-error-handler
export function setUserspaceUnhandledErrorHandler(
    handler: (errorTrigger: RoxErrorTrigger, error: Error) => void
): void;

/**
 * Unfreeze the state of all flags in code
 * Calling this function will unfreeze all flags, and using a flag will return it’s most updated value
 *
 * https://support.rollout.io/docs/flags-update-flow#section-flag-unfreeze
 * https://support.rollout.io/docs/reactnative#section--unfreeze-
 */
export function unfreeze(namespace?: string): void;

/**
 * Pulls the latest configuration and flag values down from the Rollout servers
 *
 * https://support.rollout.io/docs/reactnative#section-fetch
 */
export function fetch(): void;

/**
 * Default is untilForeground
 *
 * https://support.rollout.io/docs/reactnative#section--rox-freezeoptions-
 */
export enum FreezeOptions {
    freezeOptionUntilLaunch = 1,
    freezeOptionUntilForeground = 2,
    freezeOptionNone = 3,
}

export interface RoxFlagOptions {
    freeze?: FreezeOptions;
}

/**
 * Creates a new Flag
 * https://support.rollout.io/docs/reactnative#section--rox-freezeoptions-
 */
export class Flag {
    constructor(defaultValue?: boolean, options?: RoxFlagOptions);

    // The name of the Flag
    readonly name: string;

    // Default value of the Flag
    readonly defaultValue: boolean;

    // Returns true when the flag is enabled
    isEnabled(): boolean;

    // Unlock the Flag value from changes from the last time it was freezed
    unfreeze(): void;
}

/**
 * Used to create and manage Rollout feature flags that determine different predefined string values
 *
 * https://support.rollout.io/docs/reactnative#section--rox-string-
 */
export class RoxString {
    constructor(defaultValue: string, options?: string[]);

    // The name of the Flag
    readonly name: string;

    // Default value of the Variant
    readonly defaultValue: string;

    // Returns the current value of the Variant, accounting for value overrides
    getValue(): string;

    // Unlock the Flag value from changes from the last time it was freezed
    unfreeze(): void;
}

/**
 * Used to create and manage Rollout feature flags that determine different predefined number values
 *
 * https://support.rollout.io/docs/reactnative#section--rox-number-
 */
export class RoxNumber {
    constructor(defaultValue: number, options?: number[]);

    // The name of the Flag
    readonly name: string;

    // Default value of the Variant
    readonly defaultValue: number;

    // Returns the current value of the Variant, accounting for value overrides
    getValue(): number;

    // Unlock the Flag value from changes from the last time it was freezed
    unfreeze(): void;
}

/**
 * Override: Should only be used for development purposes (QA - Feature dev - e2e)
 *
 * When you override an existing flag value using the Rox.overrides.setOverride method,
 * the SDK will disregard existing configuration coming from the dashboard and will
 * serialize the override on disk this value will be loaded and override the flag
 * right after you call Rox.setup. To clear the override from the cache you need to
 * call the Rox.overrides.clearOverride method
 *
 * https://support.rollout.io/docs/reactnative#section--rox-overrides-
 */
export namespace overrides {
    /**
     * Sets an override value on a specific flag, this function accepts two parameters flag name (
     * full flag name including namespace) and desired value (from type String).
     * This function also saves the override value on the local device disk,
     * so it is "remembered" for the next the SDK is loaded to production.
     *
     * https://support.rollout.io/docs/reactnative#section--rox-overrides-setoverride-
     *
     * Note that for boolean flag we still give the value as a string.
     */
    function setOverride(nameSpacedFlagName: string, value: string | 'false' | 'true'): void;

    /**
     * Clears the override value from the flag (and the disk).
     *
     * https://support.rollout.io/docs/reactnative#section--rox-overrides-clearoverride-
     */
    function clearOverride(nameSpacedFlagName: string): void;

    function getOriginalValue(nameSpacedFlagName: string): string;

    /**
     * full flag name including namespace
     *
     * https://support.rollout.io/docs/reactnative#section--rox-overrides-hasoverride-
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
