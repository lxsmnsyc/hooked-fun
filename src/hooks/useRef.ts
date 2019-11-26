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
import { Slot } from '../utils/reader'

export interface MutableRef<T> {
  current: T,
}

interface MutableRefSlot<T> extends Slot<'MUTABLE_REF', MutableRef<T>>{}

const MEMORY_SIZE = 1;


function isMutableRefSlot<T>(slot: Slot<any, any>): slot is MutableRefSlot<T> {
  return slot.type === 'MUTABLE_REF';
}

export default function useRef<T>(initialValue: T): MutableRef<T> {
  return useGuard<MutableRef<T>>((reader) => {
    // read at the current position
    const slot: Optional<Slot<any, any>> = reader.read(MEMORY_SIZE)[0];

    // check if slot has a value
    if (slot) {
      // check if payload matches
      if (!isMutableRefSlot<T>(slot)) {
        throw new PayloadMismatchError(slot.type, 'MUTABLE_REF');
      }

      // move cursor
      reader.move(MEMORY_SIZE);

      // return value
      return slot.value;
    }

    // initialize slot
    const ref: MutableRefSlot<T> = {
      type: 'MUTABLE_REF',
      value: {
        current: initialValue,
      },
    };

    // write to slot
    reader.write(ref);

    // move cursor
    reader.move(MEMORY_SIZE);

    // return reference
    return ref.value;
  })
}