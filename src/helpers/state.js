// Multisig address class
var Address = iota.multisig.address;

export const generateAddressDigests = (seed, amount, securityLevel) => {
  var addresses = Object.assign([], Array(amount).fill().map((_, i) => {
    var obj = {
      depth: i,
      index: index,
      trytes: iota.multisig.getDigest(seed, index, securityLevel)
    };
    index++;
    return obj;
  }));
  return addressesToCosign
}

export const finalizeAddress = (digests) => {
  var finalAddress = new Address()
  for(var digest of digests) {
    finalAddress.absorb(digest)
  }
  finalAddress = finalAddress.finalize()
  return finalAddress
}
