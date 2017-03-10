# TallyCTF

>  Capture The Flag Scoreboard and Event Management

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install
Install Node using the most recently released installer then install Bower and Gulp globally.

Using the legacy Node installation has caused installation errors in the past, so it's recommended to use the most recent version.
```
npm install -g bower
npm install -g gulp
```

From the project root run:
```
npm install
```
The installation should end with the `postinstall` script defined in the `package.json` file that runs bower install from the same directory.
If the installation process errors be sure to run `bower install manually`.

## Usage

To serve the application locally simply run
```
gulp
```
The default task runs the project using a development environment.

To seed the database with an admin and initial user run
```
MONGO_SEED=true npm start
```
the CLI output will include there passwords. Be sure to run this only once unless you mean to overwrite the admin's password.

## Contribute

PRs accepted.

## License

GPL-3.0
