# node-red-contrib-ontime4ibm

![Version: 0.0.2](https://img.shields.io/badge/Version-0.0.2-green.svg)


## Overview

This collection of Node-RED nodes is for Ontime Group Calendar on domino server.

## Description

This package is created by modifying the http request Node.
This package is support to Ontime Group Calendar API on domino server.
It is possible to access easy to Ontime Group Calendar by use by the node that is included in this package.


## Node

**token**

* token
  - This node requires that the user is authenticated and is used to obtain an OnTime Group Calendar token for use in subsequent requests to the apihttp endpoint.

* core login
  - Used to verify the token.

* core logout
  - Tell the API that we're logging out. Not critical, more as good behavior and for logging.

* core version
  - Return some version information of API and running server.

* core usersall
  - List of all users and their information.

* core usersinfo
  - Information of specific users.

* core calendars
  - Alle calendar entries for specific users for a given time range.

* extended
  - Set the operation and parameters in this node ahead.
  - This node automatically sets ApplID, ApplVer, APIVer, CustomID, Token.


## Install

Download from github.


## Licence

Apache License Version 2.0

This software includes the work that is distributed in the Apache License 2.0


## Author

[Takeshi Yoshida](https://github.com/chemp7)


## Releace

2017/11/22 v0.0.2 fix

2017/05/07 v0.0.1 Initial
