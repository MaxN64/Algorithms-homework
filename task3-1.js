function findKthByMerge(arr1, arr2, k) {
  let i = 0, j = 0, count = 0;
  let last = null;
  
  while (count < k) {
    // Если второй массив закончился или текущий элемент первого меньше
    if (j >= arr2.length || (i < arr1.length && arr1[i] < arr2[j])) {
      last = arr1[i++];
    } else {
      last = arr2[j++];
    }
    count++;
  }
  
  return last;
}

// Пример:
const a = [100, 112, 256, 349, 770];
const b = [72,  86,  113, 119, 265, 445, 892];
console.log(findKthByMerge(a, b, 7));  // 256
