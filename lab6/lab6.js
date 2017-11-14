(function () {
  const dsForm = document.dsForm;
  const minKey = Math.pow(2, 16);
  const maxKey = minKey * 2;
  let b;

  function init() {
    let input;
    let inputFileType;
    let hash;

    let p = generatePrimeNumber(minKey, maxKey);
    let g = generateNumber(minKey, p - 1);
    let x = generateNumber(minKey, p - 1);
    let k = generatePrimeNumber(minKey, maxKey);

    while(!isCoprime(k, p - 1)) {
      k = generatePrimeNumber(minKey, maxKey);
    }

    let a = expmod(g, k, p);
    let y = expmod(g, x, p);

    dsForm.pInput.value = p;
    dsForm.gInput.value = g;
    dsForm.xInput.value = x;
    dsForm.kInput.value = k;
    dsForm.yInput.value = y;
    dsForm.aInput.value = a;

    dsForm.aInput.addEventListener('change', (event) => {
      a = event;
      digitalSignature(y, a, b, p, g, m);
    });
    dsForm.bInput.addEventListener('change', (event) => {
      b = event;
      digitalSignature(y, a, b, p, g, m);
    });
    dsForm.pInput.addEventListener('change', (event) => {
      p = event;
      digitalSignature(y, a, b, p, g, m);
    });
    dsForm.gInput.addEventListener('change', (event) => {
      g = event;
      digitalSignature(y, a, b, p, g, m);
    });
    dsForm.kInput.addEventListener('change', (event) => {
      k = event;
      digitalSignature(y, a, b, p, g, m);
    });
    dsForm.xInput.addEventListener('change', (event) => {
      x = event;
      digitalSignature(y, a, b, p, g, m);
    });
    dsForm.yInput.addEventListener('change', (event) => {
      y = event;
      digitalSignature(y, a, b, p, g, m);
    });

    dsForm.dsInput.addEventListener('change', () => {
      const reader = new FileReader();

      reader.onload = function() {
        input = reader.result;

        if (dsForm.cipherMode.value === 'decrypt') {
          const signStart = input.lastIndexOf("{");
          const sign = input.substring(signStart, input.lastIndexOf(" }"));
          a = parseInt(sign.substring(sign.indexOf("=") + 1, sign.indexOf(",")));
          b = parseInt(sign.substring(sign.lastIndexOf("=") + 1));

          input = input.substring(0, signStart).substring(0, input.lastIndexOf(`\n`));
        }

        hash = hashCode(input);
      };

      reader.readAsText(dsForm.dsInput.files[0]);
      inputFileType = dsForm.dsInput.files[0].type;
    });

    dsForm.submit.addEventListener('click', () => {
      digitalSignature(input, inputFileType, x, k, y, a, b, p, g, hash);
    });
  }

  function digitalSignature(string, fileType, x, k, y, a, b, p, g, hash) {
    return dsForm.cipherMode.value === 'encrypt'
      ? sign(string, fileType, x, k, p, a, hash)
      : checkDigitalSignature(y, a, b, p, g, hash);
  }

  function sign(text, fileType, x, k, p, a, hash) {
    b = find_b(x, a, k, hash, p);
    dsForm.bInput.value = b;
    const textFile = null;

    const makeTextFile = function (text) {
      text = text + `\n{ a=${a}, b=${b} }`;
      const data = new Blob([text], { type: fileType });

      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      return window.URL.createObjectURL(data);
    };

    const downloadLink = document.querySelector('#downloadLink');
    downloadLink.href = makeTextFile(text);
    downloadLink.click();

    dsForm.dsInput.value = null;
  }

  function checkDigitalSignature(y, a, b, p, g, hash) {
    if ((expmod(y, a, p) * expmod(a, b, p)) % p === expmod(g, hash, p)) {
      dsForm.result.value = 'Digital signature is correct!';
      dsForm.result.classList.add("is-valid");
      dsForm.result.classList.remove("is-invalid");
    } else {
      dsForm.result.value = 'Digital signature isn\'t correct!';
      dsForm.result.classList.add("is-invalid");
      dsForm.result.classList.remove("is-valid");
    }

    dsForm.dsInput.value = null;
  }

  function find_b(x, a, k, hash, p) {
    let b = 1;
    let temp = (x * a + k * b) % (p - 1);

    while (temp !== hash) {
      temp = (x * a + k * ++b) % (p - 1);
    }

    return b;
  }

  function hashCode(text) {
    return parseInt(md5(text).substring(0, 4), 16);
  }

  init();
})();
