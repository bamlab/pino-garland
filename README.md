# Pino Garland

![Logo](./docs/images/pino.png)

## What

Pino Garland is a [Pino](https://github.com/pinojs/pino) transport, that pretty prints logs to the console.
It transforms:

```json
{ "level": 30, "time": 1546300800000, "msg": "hello world", "pid": 1234, "hostname": "localhost", "v": 1 }
```

into

![Screenshot](./docs/images/example.png)

## Installation

```bash
npm install pino-garland
```

## Usage

```js
const pino = require('pino')
const transport = pino.transport({
  target: '/absolute/path/to/my-transport.mjs'
})
pino(transport)
```

### Legacy

```bash
pnpm run server | pino-garland
```

