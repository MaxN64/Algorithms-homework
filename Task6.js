

// 1) Рекурсивный quicksort (pivot = средний элемент массива)

function quicksortRecursive(arr) {
  if (arr.length <= 1) return arr.slice();
  const pivot = arr[Math.floor(arr.length / 2)];
  const less = [];
  const equal = [];
  const greater = [];
  for (const x of arr) {
    if (x < pivot) less.push(x);
    else if (x > pivot) greater.push(x);
    else equal.push(x);
  }
  return quicksortRecursive(less).concat(equal, quicksortRecursive(greater));
}


// 2) Итерационный quicksort (in-place) с опорным = середина диапазона
//    Схема Ломуто: меняем местами a[mid] и a[high], затем partition
=
function partitionMid(a, low, high) {
  const mid = Math.floor((low + high) / 2);
  [a[mid], a[high]] = [a[high], a[mid]];
  const pivot = a[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (a[j] <= pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  return i + 1;
}

function quicksortIterative(a) {
  if (a.length <= 1) return a;
  const stack = [[0, a.length - 1]];
  while (stack.length) {
    const [low, high] = stack.pop();
    if (low < high) {
      const p = partitionMid(a, low, high);
      const leftLen = p - 1 - low;
      const rightLen = high - (p + 1);
      
      if (leftLen > rightLen) {
        stack.push([low, p - 1]);
        stack.push([p + 1, high]);
      } else {
        stack.push([p + 1, high]);
        stack.push([low, p - 1]);
      }
    }
  }
  return a;
}


// 3) Merge sort (стабильная сортировка слиянием)

function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}


// Тесты (быстрые самопроверки)

function runQuickTests() {
  const tests = [
    [],
    [1],
    [1,1,1],
    [5,4,3,2,1],
    [3,1,4,1,5,9,2],
    Array.from({length:10}, (_,i)=>i),
    Array.from({length:10}, (_,i)=>9-i),
    [2,-1,0,-1,2],
    [5,5,4,4,3,3,2,2,1,1],
    // случайные
    Array.from({length:25}, ()=>Math.floor(Math.random()*201-100)),
  ];

  console.log("Проверка quicksortRecursive и quicksortIterative vs Array.prototype.sort:");
  tests.forEach((arr, idx) => {
    const expected = arr.slice().sort((a,b)=>a-b);
    const gotR = quicksortRecursive(arr);
    const gotI = quicksortIterative(arr.slice());
    const ok = JSON.stringify(gotR) === JSON.stringify(expected)
            && JSON.stringify(gotI) === JSON.stringify(expected);
    console.log(`  Тест ${String(idx+1).padStart(2,"0")}: ${ok ? "OK" : "FAIL"}`);
  });

  console.log("\nПроверка mergeSort:");
  tests.forEach((arr, idx) => {
    const expected = arr.slice().sort((a,b)=>a-b);
    const got = mergeSort(arr);
    const ok = JSON.stringify(got) === JSON.stringify(expected);
    console.log(`  Тест ${String(idx+1).padStart(2,"0")}: ${ok ? "OK" : "FAIL"}`);
  });
}

// Экспорт для возможного импорта в другие файлы
module.exports = {
  quicksortRecursive,
  quicksortIterative,
  mergeSort,
  merge,
  runQuickTests,
};
