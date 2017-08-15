import constants from '../constants'

export default class Command {
  constructor(flash, returnValue, command, ...args) {
    this.command = command
    this.flash = flash
    this.args = args
    this.returnValue = returnValue
    Command.validateCommand([command].concat(args))
  }

  toSerial() {
    return [this.command].concat(this.args).join(constants.commandSeparator)
  }

  executeSelf() {
    this.flash.executeCommand(this.toSerial())
    return this
  }

  static validateCommand(cmd) {
    for(var arg of cmd) {
      if(arg.indexOf("|") > -1) {
        throw new Error(`You cannot have a '${constants.commandSeparator}' in commands. Please remove '${constants.commandSeparator}' from the following command argument: ${arg}`)
      }
    }
  }
}
