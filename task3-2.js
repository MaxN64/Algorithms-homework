function findKthDC(arr1, arr2, k) {
  // Утилита: k-й элемент (1-based) в arr1[i:] и arr2[j:]
  function kth(i, j, k) {
    // Если один массив пуст, сразу берём из другого
    if (i >= arr1.length) return arr2[j + k - 1];
    if (j >= arr2.length) return arr1[i + k - 1];
    if (k === 1) return Math.min(arr1[i], arr2[j]);
    
    // Двигаемся на шаг примерно k/2
    const mid = Math.floor(k / 2);
    const aKey = (i + mid - 1 < arr1.length) 
                 ? arr1[i + mid - 1] 
                 : Infinity;
    const bKey = (j + mid - 1 < arr2.length) 
                 ? arr2[j + mid - 1] 
                 : Infinity;
    
    if (aKey < bKey) {
      // Отбрасываем mid элементов из arr1
      return kth(i + mid, j, k - mid);
    } else {
      // Отбрасываем mid элементов из arr2
      return kth(i, j + mid, k - mid);
    }
  }
  
  return kth(0, 0, k);
}

// Пример:
console.log(findKthDC(a, b, 7));  // 256
