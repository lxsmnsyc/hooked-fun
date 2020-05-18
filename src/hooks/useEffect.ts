/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
import useGuard from './useGuard';
import { Optional } from '../utils/types';
import PayloadMismatchError from '../utils/exceptions/PayloadMismatchError';
import { Slot } from '../utils/reader';

export type EffectCleanup = void | Optional<() => void>;
export type EffectCallback = () => EffectCleanup;

export type EffectSlot = Slot<'EFFECT', EffectCallback>;
export type EffectCleanupSlot = Slot<'EFFECT_CLEANUP', EffectCleanup>;
export type EffectDependencySlot = Slot<'EFFECT_DEPENDENCY', any[]>;

const MEMORY_SIZE = 2;

export function isEffectSlot(slot: Slot<any, any>): slot is EffectSlot {
  return slot.type === 'EFFECT';
}

export function isEffectCleanupSlot(slot: Slot<any, any>): slot is EffectCleanupSlot {
  return slot.type === 'EFFECT_CLEANUP';
}

function isEffectDependencySlot(slot: Slot<any, any>): slot is EffectDependencySlot {
  return slot.type === 'EFFECT_DEPENDENCY';
}

/**
 * Executes callback after the hooked function is called. Re-executes whenever
 * the dependencies change.
 * @param callback
 * @param dependencies
 */
export default function useEffect(callback: EffectCallback, dependencies?: any[]): void {
  return useGuard((reader) => {
    // get slots
    const [result, deps] = reader.read(MEMORY_SIZE);

    const compute = (): void => {
      if (result && isEffectCleanupSlot(result) && result.value) {
        result.value();
      }

      const newEffect: EffectSlot = {
        type: 'EFFECT',
        value: callback,
      };

      const newDependencies: EffectDependencySlot = {
        type: 'EFFECT_DEPENDENCY',
        value: dependencies || [],
      };

      // write to slot
      reader.write(newEffect, newDependencies);

      // move cursor
      reader.move(MEMORY_SIZE);
    };

    // check if result already exists
    if (result) {
      // check if payload matches
      if (!isEffectCleanupSlot(result)) {
        throw new PayloadMismatchError(result.type, 'EFFECT_CLEANUP');
      }

      // check if old dependencies is null
      if (deps == null) {
        compute();
        return;
      }

      // check if there are new dependencies
      if (dependencies) {
        if (!isEffectDependencySlot(deps)) {
          throw new PayloadMismatchError(deps.type, 'EFFECT_DEPENDENCY');
        }

        if (deps.value == null || dependencies == null) {
          compute();
          return;
        }

        // check if size of dependencies changed
        if (deps.value.length !== dependencies.length) {
          compute();
          return;
        }

        // check if one of the dependencies changed
        for (let i = 0; i < deps.value.length; i += 1) {
          if (!Object.is(deps.value[i], dependencies[i])) {
            compute();
            return;
          }
        }
      } else {
        compute();
        return;
      }

      // move cursor
      reader.move(MEMORY_SIZE);
    } else {
      compute();
    }
  });
}
