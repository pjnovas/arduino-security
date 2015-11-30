# home-portal

WebServer as a portal to your home:
* Webcamera stream using OpenCV
* Arduino to control
  * A servo motor for moving the Webcamera
  * A Relay to switch a light bulb on/off
  * A Motion detection to fire an alarm and send you an email
* Record from the web camera and post to a [server](https://github.com/pjnovas/base64-keeper) (or save to the filesystem) a collection of base64 frames
* Post a public IP to a [server](https://github.com/pjnovas/is-alive) for getting access (if is in your home you probably have a dynamic IP)

## Requirements
* NodeJS 0.12.x
* OpenCV 2.4.11+
* An Arduino board (I used an Arduino One but since it uses only 3 pins could be a Nano)
* Arduino IDE (to upload Firmata to the board - used by [johnny-five](http://johnny-five.io/))
* A Webcamera (could be any [supported by OpenCV](https://web.archive.org/web/20120815172655/http://opencv.willowgarage.com/wiki/Welcome/OS/) )
* A Servo (non continuos) any that can be attached to the camera (I used a Micro Servo SG90)
* A Relay of 5v bobbin and NC and NA of 220v/ 110v (depending on your country power) connected to a Light bulb
* A PIR Motion Sensor (I used a SR501)

## Installation and configuration
* Install OpenCV first (2.4+). For Ubuntu [try this script](https://gist.github.com/dynamicguy/3d1fce8dae65e765f7c4)
* Clone this repo
* `npm install`
* Create a `config.json` from `config.json.sample` with your configs.  

### Compile client script
Is required to have grunt-cli installed globally, if not run: `npm install grunt-cli -g`
```bash
cd /client
npm install
grunt
cd ../
```

## Get Arduino board prepared
If you haven't configured Arduino to work with johnny-five:
* Install arduino IDE
```bash
sudo apt-get update && sudo apt-get install arduino arduino-core
```
* Open Arduino IDE
* Plug the board into USB and check if is active as Serial Port in Tools > Serial Port > /dev/ttyACM0
* If Serial Port option is disabled, add the user to `dialout` group: `sudo usermod -a -G dialout [yourusename]`
* Open Arduino IDE > File > Examples > Firmata > StandardFirmata
* Click on Upload (with the Arduino board connected by USB)

[More info from Johnny-five](https://github.com/rwaldron/johnny-five/wiki/Getting-Started)

## Start server
Start server by (default port is 3000)
```bash
npm start
```

### Licence BSD-3-Clause
Check LICENSE file for details
