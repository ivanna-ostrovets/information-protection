function expmod(base, exp, mod){
  if (!exp) {
    return 1;
  }

  if (exp % 2 === 0){
    return Math.pow(expmod(base, (exp / 2), mod), 2) % mod;
  }
  else {
    return (base * expmod(base, (exp - 1), mod)) % mod;
  }
}

function generatePrimeNumber(min, max) {
  let number = generateNumber(min, max);

  return isPrime(number) ? number : generatePrimeNumber(min, max);
}

function generateNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isPrime(number) {
  let prime = true;

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      prime = false;
      break;
    }
  }

  return prime && (number > 1);
}

function isCoprime(a, b) {
  return gcd(a, b) === 1;
}

function gcd(a, b) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function findMultInverse(number, module) {
  let result = 1;

  while ((number * result) % module !== 1) {
    result += 1;

    if (result > module) {
      return null;
    }
  }

  return result;
}
