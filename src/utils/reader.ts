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
export default class Reader {
  private buffer: any[] = [];
  private cursor: number = 0;

  public read(size: number = 0) {
    return this.buffer.slice(this.cursor, this.cursor + size);
  }

  public write(...values: any[]) {
    for (let i = 0; i < values.length; i++) {
      this.buffer[this.cursor + i] = values[i]
    }
  }

  public move(size: number = 1) {
    this.cursor += size;
  }

  public resetCursor() {
    this.cursor = 0;
  }

  public reset() {
    this.cursor = 0;
    this.buffer = [];
  }

  public forEach(callback: (value: any, index: number) => void) {
    this.buffer.forEach(callback);
  }
}