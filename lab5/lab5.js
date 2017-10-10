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
    const d = findMultInverse(e, eiler);

    rsaForm.pInput.value = p;
    rsaForm.qInput.value = q;
    rsaForm.dInput.value = d;
    rsaForm.eInput.value = e;
    rsaForm.input.value = 'Fus Ro Dah';

    rsaForm.submit.addEventListener('click', () => {
      rsaForm.output.value = rsaCipher(n, d, e);
    });
  }

  function rsaCipher(n, e, d) {
    return rsaForm.cipherMode.value === 'encrypt'
      ? rsaCipherEncrypt(rsaForm.input.value, e, n)
      : rsaCipherDencrypt(rsaForm.input.value, d, n);
  }

  function rsaCipherEncrypt(message, e, n) {
    const output = [];
    message = message.split('');

    message.forEach(value => {
      console.log();
      output.push(expmod(value.charCodeAt(0), e, n));
      output.push(' ');
    });

    return output.join('');
  }

  function rsaCipherDencrypt(message, d, n) {
    const output = [];
    message = message.toUpperCase().trim().split(' ').map(value => parseInt(value));

    message.forEach(value => {
      output.push(String.fromCharCode(expmod(value, d, n)));
    });

    return output.join('');
  }

  function expmod( base, exp, mod ){
    if (!exp) {
      return 1;
    }

    if (exp % 2 === 0){
      return Math.pow(expmod(base, (exp / 2), mod), 2) % mod;
    }
    else {
      return (base * expmod(base, (exp - 1), mod)) % mod;
    }
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

  function findMultInverse(number, module) {
    let result = 1;

    while ((number * result) % module !== 1) {
      result += 1;

      if (result > module) {
        return null;
      }
    }

    return result;
  }

  init();
})();
