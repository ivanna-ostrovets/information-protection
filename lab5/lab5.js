import findMultInverse from '../utils/find-mult-inverse.js';

(function () {
  let rsaForm = document.rsaForm;
  const minKey = 1000;
  const maxKey = 9999;

  function init() {
    const p = generatePrimeNumber(minKey, maxKey);
    let temp = generatePrimeNumber(minKey, maxKey);

    while(temp === p) {
      temp = generatePrimeNumber(minKey, maxKey);
    }

    const q = temp;
    const n = p * q;
    const eiler = (p - 1) * (q - 1);

    temp = generateNumber(2, eiler - 1);

    while(!isCoprime(temp, eiler)) {
      temp = generateNumber(2, eiler - 1);
    }

    const e = temp;
    const d = findMultInverse(e);
  }

  function generatePrimeNumber(min, max) {
    const number = generateNumber(min, max);

    return isPrime(number) ? number : generatePrimeNumber(min, max);
  }

  function generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isPrime(number) {
    let prime = true;

    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        prime = false;
        break;
      }
    }

    return prime && (number > 1);
  }

  function isCoprime(a, b) {
    return gsd(a, b) === 1;
  }

  function gsd(a, b) {
    if (!b) {
      return a;
    }

    return gsd(b, a % b);
  }

  init();
})();
