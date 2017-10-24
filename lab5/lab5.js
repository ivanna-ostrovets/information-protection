(function () {
  let rsaForm = document.rsaForm;
  const minKey = 1000;
  const maxKey = 9999;

  function init() {
    const p = generatePrimeNumber(minKey, maxKey);
    let q = generatePrimeNumber(minKey, maxKey);

    while(q === p) {
      q = generatePrimeNumber(minKey, maxKey);
    }

    const n = p * q;
    const euler = (p - 1) * (q - 1);

    let e = euler;

    while(!isCoprime(e, euler)) {
      e = generateNumber(2, euler - 1);
    }

    const d = findMultInverse(e, euler);
    let input;
    let inputFileType;

    rsaForm.pInput.value = p;
    rsaForm.qInput.value = q;
    rsaForm.dInput.value = d;
    rsaForm.eInput.value = e;
    rsaForm.rsaPublicKey.value = `${e}, ${n}`;
    rsaForm.rsaPrivateKey.value = `${d}, ${n}`;

    rsaForm.rsaInput.addEventListener('change', () => {
      const reader = new FileReader();

      reader.onload = function() {
        input = reader.result;
      }

      reader.readAsText(rsaForm.rsaInput.files[0]);
      inputFileType = rsaForm.rsaInput.files[0].type;
    });

    rsaForm.submit.addEventListener('click', () => {
      const textFile = null;

      const makeTextFile = function (text) {
        const data = new Blob([text], { type: inputFileType });

        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        return window.URL.createObjectURL(data);
      };

      const downloadLink = document.querySelector('#downloadLink');
      downloadLink.href = makeTextFile(rsaCipher(input, n, e, d));
      downloadLink.click();
    });
  }

  function rsaCipher(input, n, e, d) {
    return rsaForm.cipherMode.value === 'encrypt'
      ? rsaCipherEncrypt(input, e, n)
      : rsaCipherDencrypt(input, d, n);
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
    message = message.trim().split(' ').map(value => parseInt(value));

    message.forEach(value => {
      output.push(String.fromCharCode(expmod(value, d, n)));
    });

    return output.join('');
  }

  function expmod(base, exp, mod){
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
