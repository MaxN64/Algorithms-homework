#!/usr/bin/env node
// k-way merge: объединяет несколько отсортированных файлов чисел в один.
// Использование: node mergeFiles.js out.txt in1.txt in2.txt ...

const fs = require("fs");
const readline = require("readline");
if (process.argv.length < 4) {
  console.error("Usage: node mergeFiles.js <outputFile> <inputFile1> <inputFile2> ...");
  process.exit(1);
}

const [, , outPath, ...inPaths] = process.argv;

/** Простая минимальная куча */
class MinHeap {
  constructor(cmp = (a, b) => a.value - b.value) {
    this.a = [];
    this.cmp = cmp;
  }
  size() { return this.a.length; }
  push(x) {
    this.a.push(x);
    this._siftUp(this.a.length - 1);
  }
  pop() {
    if (this.a.length === 0) return undefined;
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length > 0) {
      this.a[0] = last;
      this._siftDown(0);
    }
    return top;
  }
  _siftUp(i) {
    while (i > 0) {
      const p = ((i - 1) >> 1);
      if (this.cmp(this.a[i], this.a[p]) >= 0) break;
      [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
      i = p;
    }
  }
  _siftDown(i) {
    const n = this.a.length;
    while (true) {
      let l = i * 2 + 1, r = l + 1, m = i;
      if (l < n && this.cmp(this.a[l], this.a[m]) < 0) m = l;
      if (r < n && this.cmp(this.a[r], this.a[m]) < 0) m = r;
      if (m === i) break;
      [this.a[i], this.a[m]] = [this.a[m], this.a[i]];
      i = m;
    }
  }
}

/** Итератор чисел из файла, устойчивый к большим файлам.
 * Поддерживает числа, разделенные пробелами/переводами строк.
 */
class FileNumberStream {
  constructor(path) {
    this.path = path;
    this.rl = readline.createInterface({
      input: fs.createReadStream(path, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
    this.buffer = []; // токены, ожидающие разбора
    this.done = false;
    this.error = null;
    this._init();
  }
  _init() {
    this.rl.on("close", () => { this.done = true; });
    this.rl.on("error", (e) => { this.error = e; this.done = true; });
  }

  /** Возвращает промис с {value, done} */
  async next() {
    // если в буфере уже лежат токены — достаём
    while (this.buffer.length > 0) {
      const t = this.buffer.shift();
      if (t === "" || t === undefined) continue;
      const v = Number(t);
      if (Number.isFinite(v)) return { value: v, done: false };
      // пропускаем мусор (пустые/NaN)
    }

    // читаем новые строки, пока не найдём число либо файл не закончится
    for await (const line of this.rl) {
      const tokens = line.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 0) continue;
      this.buffer.push(...tokens);
      return this.next(); // рекурсивно обработаем буфер
    }

    // больше строк нет
    this.done = true;
    if (this.error) throw this.error;
    return { value: undefined, done: true };
  }

  async close() {
    this.rl.close();
  }
}

(async function main() {
  // Проверка существования входных файлов
  for (const p of inPaths) {
    if (!fs.existsSync(p)) {
      console.error(`Input file not found: ${p}`);
      process.exit(2);
    }
  }

  const out = fs.createWriteStream(outPath, { encoding: "utf8" });
  const streams = inPaths.map(p => new FileNumberStream(p));
  const heap = new MinHeap();

  // Инициализация: взять по одному числу из каждого файла
  for (let i = 0; i < streams.length; i++) {
    const { value, done } = await streams[i].next();
    if (!done) {
      heap.push({ value, src: i });
    }
  }

  // Основной k-way merge
  while (heap.size() > 0) {
    const { value, src } = heap.pop();
    out.write(String(value) + "\n");

    const { value: nextVal, done } = await streams[src].next();
    if (!done) {
      heap.push({ value: nextVal, src });
    }
  }

  // Завершение
  await Promise.all(streams.map(s => s.close().catch(() => {})));
  out.end(() => {
    // eslint-disable-next-line no-console
    console.log(`Merged into: ${outPath}`);
  });
})().catch(err => {
  console.error("Error:", err?.message || err);
  process.exit(3);
});
