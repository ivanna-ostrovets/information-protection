(function () {
  const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ALPH_SIZE = ALPH.length;
  const DEFAULT_INPUT = 'OSTROVETSIVANNAANATOLIIVNA';
  const DEFAULT_KEY = 9;

  let additiveForm = document.additiveForm;
  let multiplicativeForm = document.multiplicativeForm;
  let affineForm = document.affineForm;

  function init() {
    additiveForm.input.value = DEFAULT_INPUT;
    additiveForm.key.value = DEFAULT_KEY;
    additiveForm.submit.addEventListener('click', () => {
      additiveForm.output.value = getCryptographerOutput(
        additiveForm,
        additive_cipher_encrypt,
        additive_cipher_decrypt
      );
    });

    multiplicativeForm.input.value = DEFAULT_INPUT;
    multiplicativeForm.key.value = DEFAULT_KEY + 3;
    multiplicativeForm.submit.addEventListener('click', () => {
      const result = getCryptographerOutput(
        multiplicativeForm,
        multiplicative_cipher_encrypt,
        multiplicative_cipher_decrypt
      );

      multiplicativeForm.output.value = result ? result : '';
    });

    affineForm.input.value = DEFAULT_INPUT;
    affineForm.key1.value = DEFAULT_KEY;
    affineForm.key2.value = DEFAULT_KEY + 3;
    affineForm.submit.addEventListener('click', () => {
      const result = getCryptographerOutput(
        affineForm,
        affine_cipher_encrypt,
        affine_cipher_decrypt
      );

      affineForm.output.value = result ? result : '';
    });
  }

  function getCryptographerOutput(form, encryptFunc, decryptFunc) {
    if (form.name === "affineForm") {
      return form.cipherMode.value === 'encrypt'
        ? encryptFunc(parseInt(form.key1.value), parseInt(form.key2.value), form.input.value)
        : decryptFunc(parseInt(form.key1.value), parseInt(form.key2.value), form.input.value);
    }

    return form.cipherMode.value === 'encrypt'
      ? encryptFunc(parseInt(form.key.value), form.input.value)
      : decryptFunc(parseInt(form.key.value), form.input.value);
  }

  function additive_cipher_encrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) + key) % ALPH_SIZE]
    );
  }

  function additive_cipher_decrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH_SIZE + ALPH.indexOf(letter) - key) % ALPH_SIZE]
    );
  }

  function multiplicative_cipher_encrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * key) % ALPH_SIZE]
    );
  }

  function multiplicative_cipher_decrypt(key, message) {
    const multInverse = find_mult_inverse(key);

    if (multInverse) {
      return cryptographer(
        message,
        letter => ALPH[(ALPH.indexOf(letter) * multInverse) % ALPH_SIZE]
      );
    }

    multiplicativeForm.key.className += ' is-invalid';
  }

  function affine_cipher_encrypt(key1, key2, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * key1 + key2) % ALPH_SIZE]
    );
  }

  function affine_cipher_decrypt(key1, key2, message) {
    const multInverse = find_mult_inverse(key1);

    if (multInverse) {
      return cryptographer(
        message,
        letter => ALPH[((ALPH_SIZE + ALPH.indexOf(letter) - key2) * multInverse) % ALPH_SIZE]
      );
    }

    affineForm.key1.className += ' is-invalid';
  }

  function cryptographer(message, func) {
    return message.split('')
      .map(letter => ALPH.indexOf(letter) > -1 ? func(letter) : letter)
      .join('');
  }

  function find_mult_inverse(number) {
    let result = 1;

    while ((number * result) % ALPH_SIZE !== 1) {
      result += 1;

      if (result > ALPH_SIZE) {
        return null;
      }
    }

    return result;
  }

  init();
})()
