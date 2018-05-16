class Utility {

  static merge_bytes(b1, b2) {
    return parseInt(("00" + b2.toString(16)).substr(-2) + ("00" + b1.toString(16)).substr(-2), 16);
  }

  static split_byte(b1) {
    let hex = b1.toString(16);
    let b2 = parseInt(hex.slice(0,2), 16);
    let b3 = parseInt(hex.slice(2,4), 16);
    return [b2, b3];
  }


}

module.exports = {Utility};
