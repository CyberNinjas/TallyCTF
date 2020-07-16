# TallyCTF

>  Capture The Flag Scoreboard and Event Management

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install
Install Node using NVM, then install Gulp and Yarn globally.

Navigate to the following URL to download yarn:
https://classic.yarnpkg.com/en/docs/install/#windows-stable

Using the legacy Node installation has caused installation errors in the past, so it's recommended to use version 10.14.1.
```
nvm install node 10.14.1
nvm use 10.14.1
npm install -g gulp
```
Previously, npm and bower were used for dependency management, packages have been updated to use Yarn.

From the project root run:
```
yarn install
```
The installation should end with the `postinstall` script defined in the `package.json` file that runs bower install from the same directory.
If the installation process errors be sure to run `bower install manually`.

## Usage

Before starting the application, make sure local environment variables are set. The application uses these variables for connecting to Mongo. Declare MONGOHQ_URL or MONGOLAB_URI as new system environment variables with the provided MongoDB connection string (including username and password in the string).

To serve the application locally simply run
```
gulp
```
The default task runs the project using a development environment.

To seed the database with an admin and initial user, declare a system environment variable MONGO_SEED, and set it to true
```
MONGO_SEED=true
```
the CLI output will include passwords for the admin and user on startup. Be sure to run this only once unless you mean to overwrite the admin's password.

## Contribute

PRs accepted.

## License

GPL-3.0
