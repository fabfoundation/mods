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

Just go to https://fabfoundation.github.io/mods/

## To install and run `mods` locally in Windows

Kindly contact support@microsoft.com

## To install and run `mods` locally in Linux or Mac OS X

### Installing `mods`

You need to first install [node.js](https://docs.npmjs.com/getting-started/installing-node).

Install the [http-server](https://www.npmjs.com/package/http-server) npm package. Including `-g` installs the package globally, allowing you to use it as a command line tool:

`npm install http-server -g` depending on how you installed nodejs you might need to use `sudo`

Clone the `mods` repository:

`git clone https://github.com/fabfoundation/mods.git`

To talk to the serial machines you will also need to install `ws` and `serialport` npm packages inside `mods/js` folder:

```bash
cd mods/js
npm install ws
npm install serialport
```

To talk with the installed printers you will need to install `cups` and `libcups` in your distribution. Also install `node-gyp`, `rebuild` and `printer` npm packages inside `mods/js` folder:

```bash
cd mods/js
npm install node-gyp
npm install rebuild
npm install printer
```

### Running `mods` locally in your computer

Use the command line to navigate to the root of the `mods` folder (because the page we want to serve `index.html` is there), and start a web server:

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

Roland Modela MDX-20 is identified as a serial device. When you plug it, a file is created `/dev/ttyUSBx` where `x` is a number `/dev/ttyUSB0`. So for using the Roland MDX-20 you need to start `serialserver.js` inside the `mods/js` directory.

```bash
cd mods/js
node serialserver.js ::ffff:127.0.0.1 1234
```

Check that `serialserver.js` is running with: `ps aux | grep node`

> Do **not** start the server using the localhost address:  
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

1. **Why do we use ::ffff: before 127.0.0.1?** Due to a difference between IPV4 and IPV6 addresses, web socket might give a connection refused error if you use 127.0.0.1 instead of ::ffff:127.0.0.1
