# `mods` Community Edition

Just like `mods`, but cooler :sunglasses:

![](mods.png)

1. [What is `mods`?](#what-is-mods)
2. [To run `mods` online](#to-run-mods-online)
3. [To install and run `mods` locally in Windows](#to-install-and-run-mods-locally-in-windows)
4. [To install and run `mods` locally in Linux or Mac OS X](#to-install-and-run-mods-locally-in-linux-or-mac-os-x)
   1. [Installing `mods`](#installing-mods)
   2. [Running `mods` locally in your computer](#running-mods-locally-in-your-computer)
5. [Talking to the machines](#talking-to-the-machines)
   1. [Setting permissions](#setting-permissions)
   2. [Starting the local servers](#starting-the-local-servers)
      1. [Serial Server](#serial-server)
      2. [Device Server](#device-server)
      3. [Print Server](#print-server)
6. [FAQ](#faq)

## What is `mods`?

`mods` community edition is a fork of [CBA mods research project](https://gitlab.cba.mit.edu/pub/mods). `mods` is a modular cross platform tool for fablabs. It is based on independent but interrelated modules. `mods` could potentially be used for CAD, CAM, machine control, automation, building UI, read input devices, react to to physical models, and much more. The possibilies are endless.

The goal of the community edition is to provide documentation, support and help the community engage in the project and foster the development/exchange of new modules.

## To run `mods` online

Just go to https://fabfoundation.github.io/mods/ and you will be able to create toolpaths and save files. To actually make a machine move you still will need to install mods locally and run the local servers. See [Talking to the machines](#talking-to-the-machines) section.

## To install and run `mods` locally in Windows

Kindly contact support@microsoft.com

## To install and run `mods` locally in Linux or Mac OS X

### Installing `mods`

You need to first install [node.js](https://docs.npmjs.com/getting-started/installing-node), which should include `npm` package manager.

Install the [http-server](https://www.npmjs.com/package/http-server) npm package. Including `-g` installs the package globally, allowing you to use it as a command line tool:

`npm install http-server -g` depending on how you installed nodejs you might need to use `sudo`

Clone the `mods` repository:

`git clone https://github.com/fabfoundation/mods.git`

To talk to serial machines you will also need to install `ws` and `serialport` npm packages inside `mods/js` folder:

```bash
cd mods/js
npm install ws
npm install serialport
```

To talk with the installed printers you will need to install `cups` and `libcups` from your distribution. Also install the following  npm packages inside `mods/js` folder:

```bash
cd mods/js
npm install node-gyp
npm install @things-factory/node-printer
```

Only in the case that you have to controll a Roland MDX-20 with the original USB to serial cable you will need to install `python3` and `pip` packages from your distribution and also the following python libraries using pip:

```bash
sudo pip3 install serial
sudo pip3 install pyserial
sudo pip3 install websockets
```

### Running `mods` locally in your computer

You might want to run `mods` locally if you are offline. If you are opening mods from the [github](https://fabfoundation.github.io/mods/) page you can skip this step. Use the command line to navigate to the root of the `mods` folder (because the page we want to serve `index.html` is there), and start a web server:

```bash
cd mods
http-server
```

Open a browser tab and go to `127.0.0.1:8080` which is the same as `http://localhost:8080` to view the server that you just started. You should see the `mods` home screen.

## Talking to the machines

### Setting permissions

To talk to the machines you need permissions. Machines usually identify themselves as printers (`/dev/usb/lp0`) or serial devices (`/dev/ttyUSB0` in Linux or `/dev/tty.usbserial` in Mac OS X). Those files (in Linux/Unix based OS everything is a file) belong to the `root` user. But they also grant permissions if you belong to specific groups. In Ubuntu Linux, add yourself to the groups `lp`, and `dialout`. This will give you access to printers, and serial devices. To be able to add printers in CUPS, you also need to be in the `lpadmin` group.

```bash
sudo adduser $USER lp
sudo adduser $USER lpadmin
sudo adduser $USER dialout
```

In Arch Linux et al., add yourself to `lp` and `uucp` groups.

```bash
sudo usermod -a -G lp $USER
sudo usermod -a -G lpadmin $USER
sudo usermod -a -G uucp $USER
```

Logout or reboot for the changes to take effect. The permissions are now persistent.

### Starting the local servers

Depending on which machine you need to use inside `mods`, you can start local servers inside `mods/js`.

#### Serial Server

Roland Modela MDX-20 (and some other machines like the Trotec laser cutter) is a serial device. When you plug it in the computer, a file is created `/dev/ttyUSBx` where `x` is a number e.g. `/dev/ttyUSB0`. In some other cases it will appear as `/dev/ttyACMx`. If you use the original DB25 to USB cable, for controlling the Roland MDX-20 you need to start `serialserver.py` inside the `mods/py` directory:

```bash
cd mods/py
python3 serialserver.py 127.0.0.1 1234
```

On the other hand, if you are talking to a Trotec laser, or the Roland MDX-20 with a Startech or similar USB to serial cable, fo you need to start `serialserver.js` inside the `mods/js` directory.

```bash
cd mods/js
node serialserver.js ::ffff:127.0.0.1 1234
```

> Do **not** start the server using `localhost` instead of `127.0.0.1` address:  
`node serialserver.js ::ffff:localhost 1234` :point_left: do not

#### Device Server

Roland GX-24 and Roland GS-24 vinyl cutters, and the Roland SRM-20 Monofab are identified as a printer. When you plug them a file is created `/dev/usb/lpx` where `x` is a number `/dev/usb/lp0`, `/dev/usb/lp1`. Therefore, you need to start `deviceserver.js ` inside the `mods/js` directory.

```bash
cd mods/js
node deviceserver.js ::ffff:127.0.0.1 1234
```

> Do **not** start the server using the localhost address:  
`node deviceserver.js ::ffff:localhost 1234` :point_left: do not

#### Print Server

An alternative way to talk to the Roland vinyl cutters and the Epilog laser is to set up them as RAW printers in CUPS. If you did set them up that way, start `printserver.js ` inside the `mods/js` directory.

```bash
cd mods/js
node printserver.js ::ffff:127.0.0.1 1234
```

> Do **not** start the server using the localhost address:  
`node printserver.js ::ffff:localhost 1234` :point_left: do not

## FAQ

1. **Why do we add the ::ffff:prefix before 127.0.0.1?** Due to a difference between IPV4 and IPV6 addresses, web socket might give a connection refused error if you use 127.0.0.1 instead of ::ffff:127.0.0.1
