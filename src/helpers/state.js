export const initializeAddresses = (seed, amount) => {
  var addresses = Object.assign([], Array(amount).fill().map((_, i) => {
    var obj = {
      depth: i,
      index: index,
      trytes: initiateAddress(seed, index)
    };
    index++;
    return obj;
  }));
  return addressesToCosign
}
