import { execSync } from "child_process";

export class ADBInterface {

  static ConnectToDevice(deviceIP: string): ADBResult {
    var finalResult = new ADBResult(ADBResultState.Error, "Some error ocurred during connection");

    const result = execSync(`adb connect ${deviceIP}`);
    // const result = execSync(`adb devices`);
    const output = result.toLocaleString();
    console.log("Output:", output);

    if (output.startsWith('already connected to')) {
      finalResult = new ADBResult(ADBResultState.AllreadyConnected, `Allready connected to device ${this.getDeviceName(deviceIP)}`);
    } else if (output.startsWith('connected to')) {
      finalResult = new ADBResult(ADBResultState.ConnectedToDevice, `Connected to device ${this.getDeviceName(deviceIP)}`);
    } else if (output.includes('(10061)')) {
      finalResult = new ADBResult(ADBResultState.ConnectionRefused, "Connection refused:\n Target machine actively refused connection.")
    }

    return finalResult;
  }
  static async ResetPorts(): Promise<ADBResult> {
    var finalResult = new ADBResult(ADBResultState.Error, "Error while reset TCPIP Ports");
    try {
      const result = execSync(`adb tcpip 5555`);
      const output = result.toLocaleString();
      if (output.includes("restarting in TCP mode port: 5555")) {
        finalResult = new ADBResult(ADBResultState.DevicesInPortMode, "Devices in TCP mode port: 5555")
      }
    } catch (e) {
      if (e.message.includes("no devices/emulators found")) {
        finalResult = new ADBResult(ADBResultState.NoDevices, "No devices found or conected")
      }
      else
        finalResult = new ADBResult(ADBResultState.Error, e.message)
    }
    return finalResult;
  }

  static getDeviceName(deviceIP: string): string {
    const result = execSync(`adb -s ${deviceIP} shell getprop ro.product.model`).toString();
    return result;
  }

  static async DisconnectFromAllDevices(): Promise<ADBResult> {
    var finalResult = new ADBResult(ADBResultState.Error, "Error while reset TCPIP Ports");
    try {
      const result = execSync(`adb disconnect`);
      const output = result.toLocaleString();
      if (output.includes("disconnected everything")) {
        finalResult = new ADBResult(ADBResultState.DisconnectedEverthing, "Disconnected from all devices")
      }
    } catch (e) {
      finalResult = new ADBResult(ADBResultState.Error, e.message)
    }
    return finalResult;
  }
}

/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
export enum ADBResultState {
  ConnectedToDevice,
  ConnectionRefused,
  NotFound,
  NoDevices,
  Error,
  DevicesInPortMode,
  AllreadyConnected,
  DisconnectedEverthing
}
/**
 * Is an result returned by an adb connection
 */
export class ADBResult {
  state: ADBResultState;
  message: string;
  constructor(resultState: ADBResultState, message: string) {
    this.state = resultState;
    this.message = message;
  }
}
export class ADBNotFoundError extends Error {
  message = "ADB Device not found in this machine"
}