(function () {
  let transpositionForm = document.transpositionForm;

  function init() {
    transpositionForm.input.value = 'enemyattackstonight';
    // transpositionForm.input.value = 'consolelog';
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

    message = message.map((letter, index) => index > 0 && index % key.length === 0 ? letter + ',' : letter);

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

    for (let i = 0; i < message.length; i += 5) {
      for (let j = 0; j < key.length; j++) {
        temp.push(message[i + key[j]]);
      }
    }

    const transpos = temp[0].map(function(col, i) {
      return temp.map(function(row) {
        return row[i];
      });
    });

    return transpos.join('');
  }

  function transpositionCipherDencrypt(key, message) {
    let temp = [];
    let output = [];
    const it = iterator(message);
    const colunmLengthSquared = (message.length / key.length) ** 2;

    for (let i = 0; i < key.length; i++) {
      for (let j = 0; j <= colunmLengthSquared; j += 5) {
        temp[i + j] = it.next().value;
      }
    }

    const tempIterator = iterator(temp);

    for (let i = 0; i < message.length; i += 5) {
      for (let j = 0; j < key.length; j++) {
        output[i + key[j]] = tempIterator.next().value;
      }
    }

    return output.join('');
  }

  function iterator(array) {
    let nextIndex = 0;

    return {
      next: function() {
        return nextIndex < array.length ?
          { value: array[nextIndex++], done: false } :
          { done: true };
      }
    };
  }

  init();
})();
