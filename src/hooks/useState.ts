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
import Reader, { Slot } from '../utils/reader';
import { Optional } from '../utils/types';
import { PayloadMismatchError } from '../utils/exceptions';

export type StateSupplier<T> = () => T;
export type StateInitializer<T> = T | StateSupplier<T>;

export type StateTransformer<T> = (value: T) => T;
export type StateReceiver<T> = T | StateTransformer<T>;
export type SetState<T> = (state: StateReceiver<T>) => void;
export type State<T> = [T, SetState<T>];

interface StateSlot<T> extends Slot<'STATE', T> {}
interface SetStateSlot<T> extends Slot<'SET_STATE', SetState<T>> {}

function isStateSupplier<T>(value: StateInitializer<T>): value is StateSupplier<T> {
  return typeof value === 'function';
}
function isStateTransformer<T>(value: StateReceiver<T>): value is StateTransformer<T> {
  return typeof value === 'function';
}

function isStateSlot<T>(slot: Slot<any, any>): slot is StateSlot<T> {
  return slot.type === 'STATE';
}
function isSetStateSlot<T>(slot: Slot<any, any>): slot is SetStateSlot<T> {
  return slot.type === 'SET_STATE';
}

const MEMORY_SIZE = 2;

function getState<T>(initialState: StateInitializer<T>, current: Optional<Slot<any, any>>): StateSlot<T> {
  if (current == null) {
    return {
      type: 'STATE',
      value: isStateSupplier(initialState) ? initialState() : initialState,
    };
  }

  if (!isStateSlot<T>(current)) {
    throw new PayloadMismatchError(current.type, 'STATE');
  }

  return current;
}

function getSetState<T>(reader: Reader, current: Optional<Slot<any, any>>, state: StateSlot<T>): SetStateSlot<T> {
  if (current == null) {
    const index = reader.position;
    return {
      type: 'SET_STATE',
      value: (value: StateReceiver<T>) => {
        if (isStateTransformer<T>(value)) {
          reader.writeAt(index, {
            type: 'STATE',
            value: value(state.value),
          });
        } else {
          reader.writeAt(index, {
            type: 'STATE',
            value,
          });
        }

        reader.beginCall();
      },
    };
  }

  if (!isSetStateSlot<T>(current)) {
    throw new PayloadMismatchError(current.type, 'SET_STATE');
  }

  return current;
}

export default function useState<T>(initialState: StateInitializer<T>): State<T> {
  return useGuard<State<T>>((reader) => {
    const [state, setState] = reader.read(MEMORY_SIZE) as Optional<Slot<any, any>>[];

    const currentState = getState<T>(initialState, state);
    const currentSetState = getSetState<T>(reader, setState, currentState);

    reader.write(currentState, currentSetState);
    reader.move(MEMORY_SIZE);

    return [currentState.value, currentSetState.value];
  });
}