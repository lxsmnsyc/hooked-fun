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
import { Optional } from './types';

export interface Slot<P, T> {
  type: P;
  value: T;
}

export default class Reader {
  private buffer: Optional<Slot<any, any>>[] = [];

  private cursor = 0;

  public read(size = 0): Optional<Slot<any, any>>[] {
    return this.buffer.slice(this.cursor, this.cursor + size);
  }

  public write(...values: Slot<any, any>[]): void {
    for (let i = 0; i < values.length; i += 1) {
      this.buffer[this.cursor + i] = values[i];
    }
  }

  public readAt(index: number): Optional<Slot<any, any>> {
    return this.buffer[index];
  }

  public writeAt(index: number, slot: Optional<Slot<any, any>>): void {
    this.buffer[index] = slot;
  }

  public get position(): number {
    return this.cursor;
  }

  public move(size = 1): void {
    this.cursor += size;
  }

  public resetCursor(): void {
    this.cursor = 0;
  }

  public reset(): void {
    this.cursor = 0;
    this.buffer = [];
  }

  public forEach(callback: (value: Optional<Slot<any, any>>, index: number) => void): void {
    this.buffer.forEach(callback);
  }
}
