function createKey(url) {
  return url.split("").reverse().join("").slice(0, 50); //start from the other end, for higher propability of being unique
}

module.exports = createKey;
