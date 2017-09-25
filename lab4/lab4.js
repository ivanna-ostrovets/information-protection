(function () {
  let transpositionForm = document.transpositionForm;

  function init() {
    // transpositionForm.input.value = 'enemyattackstonight';
    transpositionForm.input.value = 'ettheakimaotycnzntsg';
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
    const colunmLengthSquared = colunmLength * colunmLength;

    for (let i = 0; i < message.length; i += 5) {
      for (let j = 0; j < key.length; j++) {
        temp.push(message[i + key[j]]);
      }
    }

    const it = iterator(temp);

    for (let i = 0; i < colunmLength; i++) {
      for (let j = 0; j <= colunmLengthSquared; j += 4) {
        output[i + j] = it.next().value;
      }
    }

    return output.join('');
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

    for (let i = 0; i < message.length; i += 5) {
      for (let j = 0; j < key.length; j++) {
        console.log(i + key[j], message[i + key[j]]);
        output.push(message[i + key[j]]);
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
