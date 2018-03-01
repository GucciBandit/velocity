/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Validation functions used for various types of data that can be supplied.
 * All errors are reported in the non-minified version for development. If a
 * validation fails then it should return <code>undefined</code>.
 */

import {Easings} from "./easing/easings";
import {isBoolean, isFunction, isNumber, isString} from "./types";
import {generateStep} from "./easing/step";
import {generateSpringRK4} from "./easing/spring_rk4";
import {generateBezier} from "./easing/bezier";
import {Duration} from "./constants";

/**
 * Parse a duration value and return an ms number. Optionally return a
 * default value if the number is not valid.
 */
export function parseDuration(duration: "fast" | "normal" | "slow" | number, def?: "fast" | "normal" | "slow" | number): number {
  if (isNumber(duration)) {
    return duration;
  }

  if (isString(duration)) {
    return Duration[duration.toLowerCase()] || parseFloat(duration.replace("ms", "").replace("s", "000"));
  }

  return def == null ? undefined : parseDuration(def);
}

/**
 * Validate a <code>cache</code> option.
 * @private
 */
export function validateCache(value: boolean): boolean {
  if (isBoolean(value)) {
    return value;
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'cache' to an invalid value:", value);
  }
}

/**
 * Validate a <code>begin</code> option.
 * @private
 */
export function validateBegin(value: VelocityCallback): VelocityCallback {
  if (isFunction(value)) {
    return value;
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'begin' to an invalid value:", value);
  }
}

/**
 * Validate a <code>complete</code> option.
 * @private
 */
export function validateComplete(value: VelocityCallback, noError?: true): VelocityCallback {
  if (isFunction(value)) {
    return value;
  }
  if (value != null && !noError) {
    console.warn("VelocityJS: Trying to set 'complete' to an invalid value:", value);
  }
}

/**
 * Validate a <code>delay</code> option.
 * @private
 */
export function validateDelay(value: "fast" | "normal" | "slow" | number): number {
  const parsed = parseDuration(value);

  if (!isNaN(parsed)) {
    return parsed;
  }
  if (value != null) {
    console.error("VelocityJS: Trying to set 'delay' to an invalid value:", value);
  }
}

/**
 * Validate a <code>duration</code> option.
 * @private
 */
export function validateDuration(value: "fast" | "normal" | "slow" | number, noError?: true): number {
  const parsed = parseDuration(value);

  if (!isNaN(parsed) && parsed >= 0) {
    return parsed;
  }
  if (value != null && !noError) {
    console.error("VelocityJS: Trying to set 'duration' to an invalid value:", value);
  }
}

/**
 * Validate a <code>easing</code> option.
 * @private
 */
export function validateEasing(value: VelocityEasingType, duration: number, noError?: true): VelocityEasingFn {

  if (isString(value)) {
    // Named easing
    return Easings[value];
  }
  if (isFunction(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 1) {
      // Steps
      return generateStep(value[0]);
    }
    if (value.length === 2) {
      // springRK4 must be passed the animation's duration.
      // Note: If the springRK4 array contains non-numbers,
      // generateSpringRK4() returns an easing function generated with
      // default tension and friction values.
      return generateSpringRK4(value[0], value[1], duration);
    }
    if (value.length === 4) {
      // Note: If the bezier array contains non-numbers, generateBezier()
      // returns undefined.
      return generateBezier.apply(null, value) || false;
    }
  }
  if (value != null && !noError) {
    console.error("VelocityJS: Trying to set 'easing' to an invalid value:", value);
  }
}

/**
 * Validate a <code>fpsLimit</code> option.
 * @private
 */
export function validateFpsLimit(value: number | false): number {
  if (value === false) {
    return 0;
  } else {
    const parsed = parseInt(value as any, 10);

    if (!isNaN(parsed) && parsed >= 0) {
      return Math.min(parsed, 60);
    }
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'fpsLimit' to an invalid value:", value);
  }
}


/**
 * Validate a <code>loop</code> option.
 * @private
 */
export function validateLoop(value: number | boolean): number | true {
  if (value === false) {
    return 0;
  } else if (value === true) {
    return true;
  } else {
    const parsed = parseInt(value as any, 10);

    if (!isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'loop' to an invalid value:", value);
  }
}

/**
 * Validate a <code>progress</code> option.
 * @private
 */
export function validateProgress(value: VelocityProgress): VelocityProgress {
  if (isFunction(value)) {
    return value;
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'progress' to an invalid value:", value);
  }
}

/**
 * Validate a <code>promise</code> option.
 * @private
 */
export function validatePromise(value: boolean): boolean {
  if (isBoolean(value)) {
    return value;
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'promise' to an invalid value:", value);
  }
}

/**
 * Validate a <code>promiseRejectEmpty</code> option.
 * @private
 */
export function validatePromiseRejectEmpty(value: boolean): boolean {
  if (isBoolean(value)) {
    return value;
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'promiseRejectEmpty' to an invalid value:", value);
  }
}

/**
 * Validate a <code>queue</code> option.
 * @private
 */
export function validateQueue(value: string | false, noError?: true): string | false {
  if (value === false || isString(value)) {
    return value;
  }
  if (value != null && !noError) {
    console.warn("VelocityJS: Trying to set 'queue' to an invalid value:", value);
  }
}

/**
 * Validate a <code>repeat</code> option.
 * @private
 */
export function validateRepeat(value: number | boolean): number | true {
  if (value === false) {
    return 0;
  } else if (value === true) {
    return true;
  } else {
    const parsed = parseInt(value as any, 10);

    if (!isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  if (value != null) {
    console.warn("VelocityJS: Trying to set 'repeat' to an invalid value:", value);
  }
}

/**
 * Validate a <code>speed</code> option.
 * @private
 */
export function validateSpeed(value: number): number {
  if (isNumber(value)) {
    return value;
  }
  if (value != null) {
    console.error("VelocityJS: Trying to set 'speed' to an invalid value:", value);
  }
}

/**
 * Validate a <code>sync</code> option.
 * @private
 */
export function validateSync(value: boolean): boolean {
  if (isBoolean(value)) {
    return value;
  }
  if (value != null) {
    console.error("VelocityJS: Trying to set 'sync' to an invalid value:", value);
  }
}
