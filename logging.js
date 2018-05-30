class Logger {
  constructor() {
  }
  log(line, pc=null, flags) {
    console.log(pc.toString(16) + " " + line + "\t\t\t" + flags);
  }
}

class WebLogger {
  constructor() {
    this.element = document.querySelector("#console");
  }
  log(line, pc=null, flags) {
    this.element.append(pc.toString(16) + " " + line + "\t\t\t" + flags + "\r\n\r\n");
  }
}

module.exports = {Logger, WebLogger};
