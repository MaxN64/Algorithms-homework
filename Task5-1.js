// Счётчик инверсий O(n log n) через сортировку слиянием

function mergeAndCount(arr, temp, left, mid, right) {
    let i = left;
    let j = mid;
    let k = left;
    let invCount = 0;

    while (i <= mid - 1 && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            invCount += (mid - i); // Все оставшиеся элементы в left больше arr[j]
        }
    }

    while (i <= mid - 1) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (let idx = left; idx <= right; idx++) {
        arr[idx] = temp[idx];
    }

    return invCount;
}

function mergeSortAndCount(arr, temp, left, right) {
    let invCount = 0;
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        invCount += mergeSortAndCount(arr, temp, left, mid);
        invCount += mergeSortAndCount(arr, temp, mid + 1, right);
        invCount += mergeAndCount(arr, temp, left, mid + 1, right);
    }
    return invCount;
}

function getInvCount(arr) {
    let temp = new Array(arr.length);
    return mergeSortAndCount(arr, temp, 0, arr.length - 1);
}

// Пример
let arr1 = [8, 4, 2, 1];
console.log("Number of inversions:", getInvCount(arr1));

// 2. Максимальная сумма подмассива (Divide & Conquer)

function maxCrossingSum(arr, left, mid, right) {
    let sum = 0;
    let leftSum = -Infinity;
    for (let i = mid; i >= left; i--) {
        sum += arr[i];
        if (sum > leftSum) leftSum = sum;
    }

    sum = 0;
    let rightSum = -Infinity;
    for (let i = mid + 1; i <= right; i++) {
        sum += arr[i];
        if (sum > rightSum) rightSum = sum;
    }

    return leftSum + rightSum;
}

function maxSubarraySum(arr, left = 0, right = arr.length - 1) {
    if (left === right) return arr[left];

    let mid = Math.floor((left + right) / 2);
    return Math.max(
        maxSubarraySum(arr, left, mid),
        maxSubarraySum(arr, mid + 1, right),
        maxCrossingSum(arr, left, mid, right)
    );
}

// Пример

let arr2 = [2, -3, 1, 5, -6, 9];
console.log("Maximum subarray sum is", maxSubarraySum(arr2));


// 3. Сортировка массива строк слиянием


function mergeStrings(left, right) {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSortStrings(arr) {
    if (arr.length <= 1) return arr;

    let mid = Math.floor(arr.length / 2);
    let left = mergeSortStrings(arr.slice(0, mid));
    let right = mergeSortStrings(arr.slice(mid));

    return mergeStrings(left, right);
}

// Пример
let arr3 = ["банан", "яблоко", "апельсин", "груша"];
console.log("Sorted strings:", mergeSortStrings(arr3));

