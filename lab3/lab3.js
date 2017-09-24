(function () {
  const ALPHABET = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ ';
  const VIGENERE_TABLE = getVigenereTable(ALPHABET);

  let vigenereForm = document.vigenereForm;

  function init() {
    vigenereForm.input.value = 'Захист інформації';
    vigenereForm.key.value = 'Мова';

    vigenereForm.submit.addEventListener('click', () => {
      vigenereForm.output.value = vigenereCipher(
        vigenereForm.cipherMode.value,
        vigenereForm.key.value,
        vigenereForm.input.value
      );
    });
  }

  function vigenereCipher(cipherMode, key, message) {
    key = key.toUpperCase();
    message = message.toUpperCase();
    let cipherTable = [];
    cipherTable.push(VIGENERE_TABLE[0]);

    for (let i = 0; i < key.length; i++) {
      for (let j = 0; j < VIGENERE_TABLE.length; j++) {
        if (VIGENERE_TABLE[j][0] === key[i]) {
          cipherTable.push(VIGENERE_TABLE[j]);
        }
      }
    }

    return cipherMode === 'encrypt'
      ? vigenereCipherEncrypt(key, message, cipherTable)
      : vigenereCipherDencrypt(key, message, cipherTable);
  }

  function vigenereCipherEncrypt(key, message, cipherTable) {
    let output = [];
    let cycle = 1;

    for (let i = 0; i < message.length; i++) {
      if (cycle > key.length) {
        cycle = 1;
      }

      output.push(cipherTable[cycle][cipherTable[0].indexOf(message[i])]);
      cycle++;
    }

    return output.join('');
  }

  function vigenereCipherDencrypt(key, message, cipherTable) {
    let output = [];
    let cycle = 1;

    for (let i = 0; i < message.length; i++) {
      if (cycle > key.length) {
        cycle = 1;
      }

      output.push(cipherTable[0][cipherTable[cycle].indexOf(message[i])]);
      cycle++;
    }

    return output.join('');
  }

  function getVigenereTable(alphabet) {
    let table = [];

    for (let i = 0; i < alphabet.length; i++) {
      table.push([]);

      for (let j = alphabet.length - i; j < alphabet.length; j++) {
        table[i].push(alphabet[j]);
      }

      for (let j = 0; j < alphabet.length - i; j++) {
        table[i].push(alphabet[j]);
      }
    }

    return table;
  }

  init();
})();
