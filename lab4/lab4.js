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
    let temp = [];
    let output = [];
    const colunmLength = message.length / key.length;

    for (let i = 0; i < message.length; i += 5) {
      for (let j = 0; j < key.length; j++) {
        temp.push(message[i + key[j]]);
      }
    }

    for (let i = 0; i < key.length; i++) {
      for (let j = 0; j < colunmLength; j++) {
        output.push(temp[j][i]);
      }
    }

    return output.join('');
  }

  function transpositionCipherDencrypt(key, message) {
    let output = [];

    return output.join('');
  }

  init();
})();
