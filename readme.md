# TallyCTF

>  Capture The Flag Scoreboard and Event Management

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install
After installing Node through the most recent installer released for your operating system install Bower and Gulp globally.
```
npm install -g bower
npm install -g gulp
```

From the project root run:
```
npm install
bower install
```

## Usage

To serve the application locally simply run
```
gulp
```

To seed the database with an admin and initial user run
```
MONGO_SEED=true npm start
```

## Contribute

PRs accepted.

## License

GPL-3.0
