# tslint-browser-compat
Leverage Typescript to perform static, type-aware browser support and compatability checking.

## Project status
Experimental wild-west phase

## Installation
- TODO make this actually available on NPM registry
- `yarn add --dev tslint-browser-compat`
- See the example [tslint.json](#sample-configuration) for configuration details

## Sample configuration
```json
{
  "extends": ["tslint-browser-compat"],
  "rules": {
    "no-unsupported-instance-methods": [true]
  }
}
```

## Development
- `yarn install` (make sure you've installed [yarn](https://yarnpkg.com/lang/en/docs/install))

## Running tests
- `yarn test`
- `DEBUG=1 yarn test` if you'd like some debug logging
