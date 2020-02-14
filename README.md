# `mods` Community Edition

Just like `mods`, but cooler :sunglasses:

![](mods.png)


<!-- vim-markdown-toc GFM -->

* [What is `mods`?](#what-is-mods)
* [Installation](#installation)
* [Setting persistent permissions in Linux](#setting-persistent-permissions-in-linux)
* [Using `mods`](#using-mods)

<!-- vim-markdown-toc -->

## What is `mods`?

`mods` community edition is a fork of [CBA mods research project](https://gitlab.cba.mit.edu/pub/mods). `mods` is a modular cross platform tool for fablabs. It is based on independent but interrelated modules. `mods` could potentially be used for CAD, CAM, machine control, automation, building UI, read input devices, react to to physical models, and much more. The possibilies are endless.

The goal of the community edition is to provide documentation, support and help the community engage in the project and foster the development/exchange of new modules.

## Installation

- Step 1: Install [node.js](https://docs.npmjs.com/getting-started/installing-node), which should include `npm` package manager; [python3](https://www.python.org/downloads/) and [pip3](https://pip.pypa.io/en/stable/installing/)
- Step 2: Clone the `mods` repository: `git clone https://github.com/fabfoundation/mods.git`
- Step 3: Run the installation script `sh install-mods` inside the `mods` folder

## Setting persistent permissions in Linux

To talk to the machines in Linux you need to grant permissions. In Ubuntu Linux: 

```bash
sudo adduser $USER lp
sudo adduser $USER lpadmin
sudo adduser $USER dialout
```

In Arch Linux et al.,

```bash
sudo usermod -a -G lp $USER
sudo usermod -a -G lpadmin $USER
sudo usermod -a -G uucp $USER
```

Logout or reboot for the changes to take effect. The permissions are now persistent.

## Using `mods`

- Step 1: Run `sh start-servers` inside the `mods` directory 
- Step 2: Open a browser and go to http://localhost:8080 or https://fabfoundation.github.io/mods/

