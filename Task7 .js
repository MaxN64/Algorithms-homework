function buildFreqDict(text, alphabet = "english") {
  let letters;
  if (alphabet === "english") {
    letters = "abcdefghijklmnopqrstuvwxyz";
  } else if (alphabet === "german") {
    letters = "abcdefghijklmnopqrstuvwxyzäöüß";
  } else {
    throw new Error("Алфавит должен быть 'english' или 'german'");
  }

  text = text.toLowerCase();

  // Оставляем только буквы выбранного алфавита
  let filtered = [...text].filter(ch => letters.includes(ch));

  // Считаем абсолютные частоты
  let freq = {};
  for (let ch of filtered) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  // Считаем относительные частоты
  let total = filtered.length;
  let freqNormalized = {};
  for (let ch in freq) {
    freqNormalized[ch] = +(freq[ch] / total).toFixed(4);
  }

  return { freq, freqNormalized };
}

// Пример использования:
let text = "This is a simple example. We want to build a frequency dictionary of letters.";
let { freq, freqNormalized } = buildFreqDict(text, "english");

console.log("Абсолютные частоты:", freq);
console.log("Относительные частоты:", freqNormalized);
