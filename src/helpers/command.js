export default class Command {
  constructor(returnValue, command, ...args) {
    this.command = command
    this.args = args
    this.returnValue = returnValue
    Command.validateCommand([command].concat(args))
  }

  command() {
    var ret = [this.command].concat(this.args).join(constants.commandSeparator)
  }

  executeSelf(flash) {
    flash.executeCommand(this.command())
  }

  static validateCommand(cmd) {
    for(var arg of cmd) {
      if(arg.indexOf("|") > -1) {
        throw new Error(`You cannot have a '${constants.commandSeparator}' in commands. Please remove '${constants.commandSeparator}' from the following command argument: ${arg}`)
      }
    }
  }
}
