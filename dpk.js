const crypto = require("crypto")

exports.deterministicPartitionKey = (event, {defaultKey, maxLength, hashAlgorihtm} = {defaultKey: "0", maxLength: 256, hashAlgorihtm: "sha3-512"}) => {
  const getHash = (data) => crypto.createHash(hashAlgorihtm).update(data).digest('hex')

  let candidate = !event ? defaultKey :
              event.partitionKey ? event.partitionKey : getHash(JSON.stringify(event))

  candidate = typeof candidate !== "string" ? JSON.stringify(candidate) : candidate

  if (candidate.length > maxLength) {
    candidate = getHash(candidate) 
  }

  return candidate
};
