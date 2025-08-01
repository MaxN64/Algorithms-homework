/**
 * Рекурсивная версия (наивная).
 * Время: экспоненциальное ~ O(φ^n), Память: O(n) за счёт стека.
 * Подходит только для небольших n.
 */
function fibRec(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('n должно быть неотрицательным целым');
  if (n < 2) return n;           // F(0)=0, F(1)=1
  return fibRec(n - 1) + fibRec(n - 2);
}

/**
 * Итерационная версия.
 * Время: O(n), Память: O(1).
 * Подходит для практического использования.
 */
function fibIter(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('n должно быть неотрицательным целым');
  let a = 0, b = 1;              // a=F(0), b=F(1)
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];         // следующий член
  }
  return a;                      // F(n)
}

// Примеры:
console.log(fibRec(10));   // 55
console.log(fibIter(10));  // 55
console.log(Array.from({ length: 10 }, (_, i) => fibIter(i))); // [0,1,1,2,3,5,8,13,21,34]
