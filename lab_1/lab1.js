(function () {
  const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ALPH_SIZE = ALPH.length;
  const DEFAULT_KEY = 9;
  const DEFAULT_INPUT = 'OSTROVETS IVANNA ANATOLIIVNA';

  function init() {
    let additiveForm = document.additiveForm;
    let multiplicativeForm = document.multiplicativeForm;
    let affineForm = document.affineForm;

    additiveForm.input.value = DEFAULT_INPUT;
    additiveForm.key.value = DEFAULT_KEY;
    additiveForm.submit.addEventListener('click', () => {
      additiveForm.output = getCryptographerOutput(
        additiveForm,
        additive_cipher_encrypt,
        additive_cipher_decrypt
      );
    });

    multiplicativeForm.input.value = DEFAULT_INPUT;
    multiplicativeForm.key.value = DEFAULT_KEY + 3;
    multiplicativeForm.submit.addEventListener('click', () => {
      multiplicativeForm.output = getCryptographerOutput(
        multiplicativeForm,
        multiplicative_cipher_encrypt,
        multiplicative_cipher_decrypt
      );
    });

    affineForm.input.value = DEFAULT_INPUT;
    affineForm.key1.value = DEFAULT_KEY;
    affineForm.key2.value = DEFAULT_KEY + 3;
    affineForm.submit.addEventListener('click', () => {
      affineForm.output = getCryptographerOutput(
        affineForm,
        affine_cipher_encrypt,
        affine_cipher_decrypt
      );
    });
  }

  function getCryptographerOutput(form, encryptFunc, decryptFunc) {
    return form.cipherMode.value === 'encrypt'
      ? encryptFunc(form.key.value, form.input.value)
      : decryptFunc(form.key.value, form.input.value);
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
      letter => ALPH[(ALPH.indexOf(letter) - key) % ALPH_SIZE]
    );
  }

  function multiplicative_cipher_encrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * key) % ALPH_SIZE]
    );
  }

  function multiplicative_cipher_decrypt(key, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * find_mult_inverse(key, ALPH_SIZE)) % ALPH_SIZE]
    );
  }

  function affine_cipher_encrypt(key1, key2, message) {
    return cryptographer(
      message,
      letter => ALPH[(ALPH.indexOf(letter) * key1 + key2) % ALPH_SIZE]
    );
  }

  function affine_cipher_decrypt(key1, key2, message) {
    return cryptographer(
      message,
      letter => ALPH[((ALPH.indexOf(letter) - key2)) * find_mult_inverse(key1, ALPH_SIZE) % ALPH_SIZE]
    );
  }

  function cryptographer(message, func) {
    console.log(message.split('')
      .map(letter => ALPH.indexOf(letter) > -1 ? func(letter) : letter)
      .join(''));
    return message.split('')
      .map(letter => ALPH.indexOf(letter) > -1 ? func(letter) : letter)
      .join('');
  }

  function find_mult_inverse(number) {
    for (let i = 1; i < ALPH_SIZE; i++) {
      if ((number * i) % ALPH_SIZE !== 1) {
        return i;
      }
    }

    return null;
  }

  init();
})()
