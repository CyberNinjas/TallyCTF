# TallyCTF

>  Capture The Flag Scoreboard and Event Management

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install
Install Node using the most recently released installer then install Bower and Gulp globally.
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
