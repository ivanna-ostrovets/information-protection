export default function findMultInverse(number, module) {
  let result = 1;

  while ((number * result) % module !== 1) {
    result += 1;

    if (result > module) {
      return null;
    }
  }

  return result;
}
