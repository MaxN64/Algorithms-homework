class Stack {
  constructor() {
    this.data = [];
  }

  // empty — проверка стека на пустоту
  empty() {
    return this.data.length === 0;
  }

  // push — вставка нового элемента
  push(element) {
    this.data.push(element);
  }

  // pop — удаление и возврат элемента с вершины
  pop() {
    if (this.empty()) {
      throw new Error("Stack is empty");
    }
    return this.data.pop();
  }

  // peek — возвращает элемент с вершины, но не удаляет его
  peek() {
    if (this.empty()) {
      throw new Error("Stack is empty");
    }
    return this.data[this.data.length - 1];
  }

  
  search(element) {
    for (let i = this.data.length - 1, pos = 1; i >= 0; i--, pos++) {
      if (this.data[i] === element) {
        return pos;
      }
    }
    return -1;
  }

  // size — текущий размер стека
  size() {
    return this.data.length;
  }
}


const st = new Stack();
console.log(st.empty()); // true

st.push(10);
st.push(20);
st.push(30);

console.log(st.peek());       // 30
console.log(st.search(30));   // 1 (на вершине)
console.log(st.search(10));   // 3 (внизу)
console.log(st.search(99));   // -1

console.log(st.pop()); // 30
console.log(st.pop()); // 20
console.log(st.size()); // 1
console.log(st.empty()); // false
console.log(st.pop()); // 10
console.log(st.empty()); // true
