(function () {
  const PLAYFAIR_KEY = [
    ['L', 'G', 'D', 'B', 'A'],
    ['Q', 'M', 'H', 'E', 'C'],
    ['U', 'R', 'N', 'I', 'F'],
    ['X', 'V', 'S', 'O', 'K'],
    ['Z', 'Y', 'W', 'T', 'P'],
  ];
  const DOUBLE_SQUARE_KEY_1 = [
    ['Ч', ' ', 'В', 'І', 'П'],
    ['О', 'К', 'Й', 'Д', 'У'],
    ['Г', 'Ш', 'З', 'Є', 'Ф'],
    ['Л', 'Ї', 'Х', 'А', ','],
    ['Ю', 'Р', 'Ж', 'Щ', 'Н'],
    ['Ц', 'Б', 'И', 'Т', 'Ь'],
    ['.', 'С', 'Я', 'М', 'Е'],
  ];
  const DOUBLE_SQUARE_KEY_2 = [
    ['Е', 'Л', 'Ц', 'Й', 'П'],
    ['.', 'Х', 'Ї', 'А', 'Н'],
    ['Ш', 'Д', 'Є', 'К', 'С'],
    ['І', ' ', 'Б', 'Ф', 'У'],
    ['Я', 'Т', 'И', 'Ч', 'Г'],
    ['М', 'О', ',', 'Ж', 'Ь'],
    ['В', 'Щ', 'З', 'Ю', 'Р'],
  ];
  const PLAYFAIR_SYMBOL = 'X';

  let playfairForm = document.playfairForm;
  let doubleSquareForm = document.doubleSquareForm;

  function init() {
    playfairForm.input.value = 'hello';
    playfairForm.submit.addEventListener('click', () => {
      playfairForm.output.value = playfairCipher(playfairForm.cipherMode.value, playfairForm.input.value);
    });

    doubleSquareForm.input.value = 'приїжджаю шостого';
    doubleSquareForm.submit.addEventListener('click', () => {
      doubleSquareForm.output.value = doubleSquareCipher(doubleSquareForm.cipherMode.value, doubleSquareForm.input.value);
    });
  }

  function playfairCipher(cipherMode, message) {
    message = message.toUpperCase();

    return cipherMode === 'encrypt'
      ? playfairCipherEncrypt(message)
      : playfairCipherDencrypt(message);
  }

  function playfairCipherEncrypt(message) {
    let newMessage = [];
    let output = [];

    for (let i = 0; i < message.length; i += 2) {
      newMessage.push(message[i]);

      if (message[i] === message[i+1]) {
        newMessage.push(PLAYFAIR_SYMBOL);
      }

      if (i !== message.length - 1) {
        newMessage.push(message[i+1]);
      }
    }

    if (newMessage.length % 2 !== 0) {
      newMessage.push(PLAYFAIR_SYMBOL);
    }

    for (let i = 0; i < newMessage.length; i += 2) {
      const index1 = twoDimensionalIndexOf(newMessage[i], PLAYFAIR_KEY);
      const index2 = twoDimensionalIndexOf(newMessage[i+1], PLAYFAIR_KEY);

      if (index1[0] === index2[0]) {
        output.push(PLAYFAIR_KEY[index1[0]][(index1[1] + 1) % PLAYFAIR_KEY[0].length]);
        output.push(PLAYFAIR_KEY[index2[0]][(index2[1] + 1) % PLAYFAIR_KEY[0].length]);
      } else if (index1[1] === index2[1]) {
        output.push(PLAYFAIR_KEY[(index1[0] + 1) % PLAYFAIR_KEY.length][index1[1]]);
        output.push(PLAYFAIR_KEY[(index2[0] + 1) % PLAYFAIR_KEY.length][index2[1]]);
      } else {
        output.push(PLAYFAIR_KEY[index1[0]][index2[1]]);
        output.push(PLAYFAIR_KEY[index2[0]][index1[1]]);
      }
    }

    return output.join('');
  }

  function playfairCipherDencrypt(message) {
    let output = [];

    for (let i = 0; i < message.length; i += 2) {
      const index1 = twoDimensionalIndexOf(message[i], PLAYFAIR_KEY);
      const index2 = twoDimensionalIndexOf(message[i+1], PLAYFAIR_KEY);

      if (index1[0] === index2[0]) {
        output.push(PLAYFAIR_KEY[index1[0]][(PLAYFAIR_KEY[0].length + index1[1] - 1) % PLAYFAIR_KEY[0].length]);
        output.push(PLAYFAIR_KEY[index2[0]][(PLAYFAIR_KEY[0].length + index2[1] - 1) % PLAYFAIR_KEY[0].length]);
      } else if (index1[1] === index2[1]) {
        output.push(PLAYFAIR_KEY[(PLAYFAIR_KEY.length + index1[0] - 1) % PLAYFAIR_KEY.length][index1[1]]);
        output.push(PLAYFAIR_KEY[(PLAYFAIR_KEY.length + index2[0] - 1) % PLAYFAIR_KEY.length][index2[1]]);
      } else {
        output.push(PLAYFAIR_KEY[index1[0]][index2[1]]);
        output.push(PLAYFAIR_KEY[index2[0]][index1[1]]);
      }
    }

    return output.join('');
  }

  function doubleSquareCipher(cipherMode, message) {
    message = message.toUpperCase();

    return cipherMode === 'encrypt'
      ? doubleSquareCipherEncrypt(message, DOUBLE_SQUARE_KEY_1, DOUBLE_SQUARE_KEY_2)
      : doubleSquareCipherDencrypt(message);
  }

  function doubleSquareCipherEncrypt(message, key1, key2) {
    let output = [];

    if (message.length % 2 !== 0) {
      message += ' ';
    }

    for (let i = 0; i < message.length; i += 2) {
      const index1 = twoDimensionalIndexOf(message[i], key1);
      const index2 = twoDimensionalIndexOf(message[i+1], key2);

      output.push(key2[index1[0]][index2[1]]);
      output.push(key1[index2[0]][index1[1]]);
    }

    return output.join('');
  }

  function doubleSquareCipherDencrypt(message) {
    return doubleSquareCipherEncrypt(message, DOUBLE_SQUARE_KEY_2, DOUBLE_SQUARE_KEY_1);
  }

  function twoDimensionalIndexOf(string, array) {
    for (let i = 0; i < array.length; i++) {
      const index = array[i].indexOf(string);

      if (index > -1) {
        return [i, index];
      }
    }
  }

  init();
})();
