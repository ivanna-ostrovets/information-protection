(function () {
  const ALPHABET = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ ';
  const VIGENERE_TABLE = getVigenereTable(ALPHABET);

  let vigenereForm = document.vigenereForm;

  function init() {
    console.log(VIGENERE_TABLE);
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

  function getVigenereTable(alph) {
    let table = [];

    for (let i = 0; i < alph.length; i++) {
      table.push([]);

      for (let j = alph.length - i; j < alph.length; j++) {
        table[i].push(alph[j]);
      }

      for (let j = 0; j < alph.length - i; j++) {
        table[i].push(alph[j]);
      }
    }

    return table;
  }

  init();
})();
