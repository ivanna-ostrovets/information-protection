(function () {
  const PLAYFAIR_KEY = [
    ['L', 'G', 'D', 'B', 'A'],
    ['Q', 'M', 'H', 'E', 'C'],
    ['U', 'R', 'N', 'I', 'F'],
    ['X', 'V', 'S', 'O', 'K'],
    ['Z', 'Y', 'W', 'T', 'P'],
  ];
  const TWO_SQUARE_KEY_1 = [
    ['Ч', '', 'В', 'І', 'П'],
    ['О', 'К', 'Й', 'Д', 'У'],
    ['Г', 'Ш', 'З', 'Є', 'Ф'],
    ['Л', 'Ї', 'Х', 'А', ','],
    ['Ю', 'Р', 'Ж', 'Щ', 'Н'],
    ['Ц', 'Б', 'И', 'Т', 'Ь'],
    ['.', 'С', 'Я', 'Ь', 'Е'],
  ];
  const TWO_SQUARE_KEY_2 = [
    ['Е', 'Л', 'Ц', 'Й', 'П'],
    ['.', 'Х', 'Ї', 'А', 'Н'],
    ['Ш', 'Д', 'Є', 'К', 'С'],
    ['І', '', 'Б', 'Ф', 'У'],
    ['Я', 'Т', 'И', 'Ч', 'Г'],
    ['М', 'О', ',', 'Ж', 'Ь'],
    ['В', 'Щ', 'З', 'Ю', 'Р'],
  ];

  let playfairForm = document.playfairForm;
  let twoSquareForm = document.twoSquareForm;

  function init() {
    playfairForm.input.value = 'hello';
    playfairForm.submit.addEventListener('click', () => {
      playfairForm.output.value = playfairCipher(playfairForm.input.value);
    });

    twoSquareForm.input.value = 'нехай консули будуть уважні';
    twoSquareForm.submit.addEventListener('click', () => {
      // twoSquareForm.output.value = ;
    });
  }

  function playfairCipher(message) {
    message = message.toUpperCase();
    message = message.replace('J', 'I');
    let newMessage = [];
    let output = [];

    for (let i = 0; i < message.length; i += 2) {
      newMessage.push(message[i]);

      if (message[i] === message[i+1]) {
        newMessage.push('X');
      }

      if (i !== message.length - 1) {
        newMessage.push(message[i+1]);
      }
    }

    if (newMessage.length % 2 !== 0) {
      newMessage.push('X');
    }

    for (let i = 0; i < newMessage.length; i += 2) {
      const index1 = twoDimensionalIndexOf(newMessage[i]);
      const index2 = twoDimensionalIndexOf(newMessage[i+1]);

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

  function twoDimensionalIndexOf(string) {
    for (let i = 0; i < PLAYFAIR_KEY.length; i++) {
      const index = PLAYFAIR_KEY[i].indexOf(string);

      if (index > -1) {
        return [i, index];
      }
    }
  }

  init();
})();
