class Utility {

  static merge_bytes(b1, b2) {
//    return parseInt(("00" + b2.toString(16)).substr(-2) + ("00" + b1.toString(16)).substr(-2), 16);
    return ((b2 << 8) + b1);
  }

  static split_byte(b1) {
    let byte = parseInt(b1);
    let first_byte = ((byte & 0xFF00) >> 8);
    let second_byte = (byte & 0xFF);
    return [first_byte, second_byte];
  }

  static bit(number, n) {
    return ((number >> (n)) & 1);
  }

}

module.exports = Utility;
