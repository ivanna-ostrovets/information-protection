(function () {
  const dsForm = document.dsForm;
  const minKey = 1;
  const maxKey = 9;

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
    let b;

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

        hash = hashCode(input);
        b = find_b(x, a, k, hash, p);
        dsForm.bInput.value = b;
      }

      reader.readAsText(dsForm.dsInput.files[0]);
      inputFileType = dsForm.dsInput.files[0].type;
    });

    dsForm.submit.addEventListener('click', () => {
      digitalSignature(input, inputFileType, y, a, b, p, g, hash);
    });
  }

  function digitalSignature(string, fileType, y, a, b, p, g, hash) {
    return dsForm.cipherMode.value === 'encrypt'
      ? sign(string, fileType, a, b)
      : checkDigitalSignature(y, a, b, p, g, hash);
  }

  function sign(text, fileType, a, b) {
    const textFile = null;

    const makeTextFile = function (text) {
      const data = new Blob([text], { type: fileType });

      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      return window.URL.createObjectURL(data);
    };

    const downloadLink = document.querySelector('#downloadLink');
    downloadLink.href = makeTextFile(text);
    downloadLink.click();
  }

  function checkDigitalSignature(y, a, b, p, g, hash) {
    if ((expmod(y, a, p) * expmod(a, b, p)) % p === expmod(g, hash, p)) {
      dsForm.result.value = 'Digital signature is correct!';
      dsForm.result.className += ' is-valid';
    } else {
      dsForm.result.value = 'Digital signature isn\'t correct!';
      dsForm.result.className += ' is-invalid';
    }
  }

  function find_b(x, a, k, hash, p) {
    let b = 1;
    let temp = (x * a + k * b) % (p - 1);

    while (temp !== hash) {
      temp = (x * a + k * ++b) % (p - 1);
    }

    return b;
  }

  function hashCode(string) {
    let hash = 0;

    if (string.length === 0) {
      return hash;
    }

    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);

      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  init();
})();
