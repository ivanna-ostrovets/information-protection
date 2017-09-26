(function () {
  let transpositionForm = document.transpositionForm;

  function init() {
    transpositionForm.input.value = 'enemyattackstonight';
    transpositionForm.key.value = '31452';

    transpositionForm.submit.addEventListener('click', () => {
      transpositionForm.output.value = transpositionCipher(
        transpositionForm.cipherMode.value,
        transpositionForm.key.value,
        transpositionForm.input.value
      );
    });
  }

  function transpositionCipher(cipherMode, key, message) {
    key = key.split('').map(number => parseInt(number) - 1);

    while (message.length % 5 !== 0) {
      message += 'z';
    }

    return cipherMode === 'encrypt'
      ? transpositionCipherEncrypt(key, message)
      : transpositionCipherDencrypt(key, message);
  }

  function transpositionCipherEncrypt(key, message) {
    message = _.words(message, RegExp(`.{${key.length}}`, 'g'))
      .map(string => string.split(''));

    for (let i = 0; i < message.length; i++) {
      const temp = [];

      for (let j = 0; j < key.length; j++) {
        temp.push(message[i][key[j]]);
      }

      message[i] = temp;
    }

    message = _.zip.apply(_, message);

    return message.map(row => row.join('')).join('');
  }

  function transpositionCipherDencrypt(key, message) {
    message = _.words(message, RegExp(`.{${message.length / key.length}}`, 'g'))
      .map(string => string.split(''));

    message = _.zip.apply(_, message);

    for (let i = 0; i < message.length; i++) {
      const temp = [];

      for (let j = 0; j < key.length; j++) {
        temp[key[j]] = message[i][j];
      }

      message[i] = temp;
    }

    return message.map(row => row.join('')).join('');
  }

  init();
})();
