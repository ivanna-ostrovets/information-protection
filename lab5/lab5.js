(function () {
  let rsaForm = document.rsaForm;
  const minKey = 1000;
  const maxKey = 9999;
  let n;

  function init() {
    const p = generatePrimeNumber(minKey, maxKey);
    let q = generatePrimeNumber(minKey, maxKey);

    while(q === p) {
      q = generatePrimeNumber(minKey, maxKey);
    }

    n = p * q;
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
    rsaForm.rsaPublicKey_e.value = e;
    rsaForm.rsaPublicKey_n.value = n;
    rsaForm.rsaPrivateKey_d.value = d;
    rsaForm.rsaPrivateKey_n.value = n;

    rsaForm.rsaPublicKey_e.addEventListener('change', (event) => {
      rsaForm.eInput.value = event.target.value;
    });
    rsaForm.rsaPublicKey_n.addEventListener('change', (event) => {
      n = event.target.value;
      rsaForm.rsaPrivateKey_n.value = event.target.value;
    });

    rsaForm.rsaPrivateKey_d.addEventListener('change', (event) => {
      rsaForm.dInput.value = event.target.value;
    });
    rsaForm.rsaPrivateKey_n.addEventListener('change', (event) => {
      n = event.target.value;
      rsaForm.rsaPublicKey_n.value = event.target.value;
    });

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
      downloadLink.href = makeTextFile(rsaCipher(
        input,
        n,
        rsaForm.eInput.value,
        rsaForm.dInput.value,
      ));
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

  init();
})();
