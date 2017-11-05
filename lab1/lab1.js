(function () {
  const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ALPH_SIZE = ALPH.length;
  const DEFAULT_INPUT = 'OSTROVETSIVANNAANATOLIIVNA';
  const DEFAULT_KEY = 9;

  let additiveForm = document.additiveForm;
  let multiplicativeForm = document.multiplicativeForm;
  let affineForm = document.affineForm;

  function init() {
    document.getElementById('accordionOneOutput').style.display = 'none';
    document.getElementById('accordionTwoOutput').style.display = 'none';
    document.getElementById('accordionThreeOutput').style.display = 'none';

    additiveForm.input.value = DEFAULT_INPUT;
    additiveForm.key.value = DEFAULT_KEY;
    additiveForm.submit.addEventListener('click', () => {
      additiveForm.output.value = getCryptographerOutput(
        parseInt(additiveForm.key.value),
        additiveForm.input.value,
        additiveForm.cipherMode.value,
        additiveCipherEncrypt,
        additiveCipherDecrypt
      );

      if (additiveForm.cipherMode.value === 'decrypt') {
        document.getElementById('accordionOneOutput').style.display = 'block';

        decryptWithoutKey(
          'outputListOne',
          additiveForm,
          additiveCipherEncrypt,
          additiveCipherDecrypt
        );
      }
    });

    multiplicativeForm.input.value = DEFAULT_INPUT;
    multiplicativeForm.key.value = DEFAULT_KEY + 3;
    multiplicativeForm.submit.addEventListener('click', () => {
      const result = getCryptographerOutput(
        parseInt(multiplicativeForm.key.value),
        multiplicativeForm.input.value,
        multiplicativeForm.cipherMode.value,
        multiplicativeCipherEncrypt,
        multiplicativeCipherDecrypt
      );

      multiplicativeForm.output.value = result ? result : '';

      if (multiplicativeForm.cipherMode.value === 'decrypt') {
        document.getElementById('accordionTwoOutput').style.display = 'block';

        decryptWithoutKey(
          'outputListTwo',
          multiplicativeForm,
          multiplicativeCipherEncrypt,
          multiplicativeCipherDecrypt
        );
      }
    });

    affineForm.input.value = DEFAULT_INPUT;
    affineForm.key1.value = DEFAULT_KEY;
    affineForm.key2.value = DEFAULT_KEY + 3;
    affineForm.submit.addEventListener('click', () => {
      const result = getCryptographerOutput(
        parseInt(affineForm.key1.value),
        affineForm.input.value,
        affineForm.cipherMode.value,
        affineCipherEncrypt,
        affineCipherDecrypt,
        parseInt(affineForm.key2.value)
      );

      affineForm.output.value = result ? result : '';

      if (affineForm.cipherMode.value === 'decrypt') {
        document.getElementById('accordionThreeOutput').style.display = 'block';

        decryptWithoutKey(
          'outputListThree',
          affineForm,
          affineCipherEncrypt,
          affineCipherDecrypt
        );
      }
    });
  }

  function decryptWithoutKey(resultDivId, form, encryptFunc, decryptFunc) {
    let output = document.getElementById(resultDivId);

    while (output.hasChildNodes()) {
      output.removeChild(output.lastChild);
    }

    if (form.name !== 'affineForm') {
      for (let i = 1; i < ALPH_SIZE + 1; i++) {
        const div = document.createElement('div');
        const result = getCryptographerOutput(
          i,
          form.input.value,
          form.cipherMode.value,
          encryptFunc,
          decryptFunc
        );

        div.appendChild(document.createTextNode(`Key: ${i} - ${result ? result : 'This key can\'t be used for cipher method!'}`));
        output.appendChild(div);
      }
    } else {
      for (let i = 1; i < ALPH_SIZE + 1; i++) {
        for (let j = 1; j < ALPH_SIZE + 1; j++) {
          const div = document.createElement('div');

          const result = getCryptographerOutput(
            i,
            form.input.value,
            form.cipherMode.value,
            encryptFunc,
            decryptFunc,
            j
          );

          div.appendChild(document.createTextNode(`${i}, ${j} - ${result ? result : 'This key can\'t be used for cipher method!'}`));
          output.appendChild(div);
        }
      }
    }
  }

  function getCryptographerOutput(key1, message, cipherMode, encryptFunc, decryptFunc, key2=null) {
    if (key2) {
      return cipherMode === 'encrypt'
        ? encryptFunc(key1, key2, message)
        : decryptFunc(key1, key2, message);
    }

    return cipherMode === 'encrypt'
      ? encryptFunc(key1, message)
      : decryptFunc(key1, message);
  }

  function additiveCipherEncrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) + key) % ALPH_SIZE]
    );
  }

  function additiveCipherDecrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH_SIZE + ALPH.indexOf(letter) - key) % ALPH_SIZE]
    );
  }

  function multiplicativeCipherEncrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * key) % ALPH_SIZE]
    );
  }

  function multiplicativeCipherDecrypt(key, message) {
    const multInverse = findMultInverse(key, ALPH_SIZE);

    if (multInverse) {
      return cryptographer(
        message,
        letter => ALPH[(ALPH.indexOf(letter) * multInverse) % ALPH_SIZE]
      );
    }

    multiplicativeForm.key.className += ' is-invalid';
  }

  function affineCipherEncrypt(key1, key2, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * key1 + key2) % ALPH_SIZE]
    );
  }

  function affineCipherDecrypt(key1, key2, message) {
    const multInverse = findMultInverse(key1, ALPH_SIZE);

    if (multInverse) {
      return cryptographer(
        message,
        letter => ALPH[((ALPH_SIZE + ALPH.indexOf(letter) - key2) * multInverse) % ALPH_SIZE]
      );
    }

    if (multInverse == null) {
      affineForm.key1.className += ' is-invalid';
    }
  }

  function cryptographer(message, func) {
    return message.split('')
      .map(letter => ALPH.indexOf(letter) > -1 ? func(letter) : letter)
      .join('');
  }

  init();
})();
