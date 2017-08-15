export const generateAddressDigests = (iota, seed, amount, index, securityLevel) => {
  var addressesToCosign = Object.assign([], Array(amount).fill().map((_, i) => {
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

export const finalizeAddress = (iota, digests) => {
  // Multisig address class
  var Address = iota.multisig.address;
  var finalAddress = new Address()
  for(var digest of digests) {
    finalAddress.absorb(digest.trytes)
  }
  finalAddress = finalAddress.finalize()
  return finalAddress
}
