/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
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
 * @copyright Alexis Munsayac 2019
 */
import useGuard from './useGuard';
import { Optional } from '../utils/types';
import { PayloadMismatchError } from '../utils/exceptions';
import { Slot } from '../utils/reader';

export type MemoCallback<R> = () => R;

interface MemoSlot<T> extends Slot<'MEMO', T>{}
interface MemoDependencySlot extends Slot<'MEMO_DEPENDENCY', Optional<any[]>> {}

const MEMORY_SIZE = 2;

function isMemoSlot<T>(slot: Slot<any, any>): slot is MemoSlot<T> {
  return slot.type === 'MEMO';
}

function isMemoDependencySlot(slot: Slot<any, any>): slot is MemoDependencySlot {
  return slot.type === 'MEMO_DEPENDENCY';
}

/**
 * A hook that executes the given callback and receives its value. The value is kept
 * until dependencies are changed, in which the given callback is called again to provide
 * the new value.
 * @param callback 
 * @param dependencies 
 */
export default function useMemo<T>(callback: MemoCallback<T>, dependencies?: any[]): T {
  return useGuard<T>((reader) => {
    // get slots
    const [result, deps] = reader.read(MEMORY_SIZE) as Optional<Slot<any, any>>[];

    const compute = () => {
      const newResult: MemoSlot<T> = {
        type: 'MEMO',
        value: callback(),
      };

      const newDependencies: MemoDependencySlot = {
        type: 'MEMO_DEPENDENCY',
        value: dependencies || [],
      };

      // write to slot
      reader.write(newResult, newDependencies);

      // move cursor
      reader.move(MEMORY_SIZE);

      return newResult.value;
    };

    // check if result already exists
    if (result) {
      // check if payload matches
      if (!isMemoSlot<T>(result)) {
        throw new PayloadMismatchError(result.type, 'MEMO');
      }

      // check if old dependencies is null
      if (deps == null) {
        return compute();
      }

      // check if there are new dependencies
      if (dependencies) {
        if (!isMemoDependencySlot(deps)) {
          throw new PayloadMismatchError(deps.type, 'MEMO_DEPENDENCY');
        }

        if (deps.value == null || dependencies == null) {
          return compute();
        }

        // check if size of dependencies changed
        if (deps.value.length !== dependencies.length) {
          return compute();
        }

        // check if one of the dependencies changed
        for (let i = 0; i < deps.value.length; i++) {
          if (!Object.is(deps.value[i], dependencies[i])) {
            return compute();
          }
        }
      } else {
        return compute();
      }

      // move cursor
      reader.move(MEMORY_SIZE);

      return result.value;
    }

    return compute();
  });
}