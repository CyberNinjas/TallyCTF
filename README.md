# TallyCTF

>  Capture The Flag Scoreboard and Event Management

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install
Install [Node v10 LTS](https://nodejs.org/en/about/releases) via the [official installer](https://nodejs.org/download/release/latest-v10.x) then install Gulp globally.

NOTE: Using the legacy Node installation has caused installation errors in the past, so it's recommended to use the most recent version.

```sh
npm install -g gulp
```

From the project root run:

```sh
npm install
```

## Usage

To serve the application locally simply run

```sh
gulp
```

The default task runs the project using a development environment.

To seed the database with an admin and initial user run

```sh
MONGO_SEED=true npm start
```

the CLI output will include the passwords. Be sure to run this only once unless you mean to overwrite the admin's password.

## Contribute

PRs accepted.

## License

[GPL-3.0](LICENSE)
