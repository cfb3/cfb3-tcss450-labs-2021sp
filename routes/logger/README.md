# cfb3logger
[https://github.com/cfb3/cfb3logger](https://github.com/cfb3/cfb3logger)<hr />

## SUMMARY
A simple logging package for Node.js projects with customizable formatting for different logging levels.<hr />

## Usage
Logger has 6 different logging levels: <br />
`'default logging', info, verbose, debug, warn, error`<br />
Each of these levels has a corresponding function with a default color formatting. Each function accepts two arguments, a tag and the logging message. 

### Obtaining a Logger
```javascript
const logger = require('logger')
```
### Logging
```javascript
logger('Log tag', 'Log message') //logs to the default logging level
logger.info('hello.js', 'Check this out!') //logs an informational message
logger.error('hello.js', 'Oh no!') //logs an error
```
###  Formatting
Each log level has its own default formatting. The formatting may be changed by passing a customized configuration json using:
 ```javascript
 logger.setConfig(require('./custom_config.json'))
 ```
 Use the following JSON structure for the configuration JSON: <br />
 (Note:  **_all_** keys required for **_all_** logging levels)
 ```javascript
 {
    "log": {
        "tag" : {
            "fg": "default",
            "bg": "default"
        },
        "msg": {
            "fg": "default",
            "bg": "default"
        }
    },
    "verbose": {
        "tag" : {
            "fg": "fgBlack",
            "bg": "bgYellow"
        },
        "msg": {
            "fg": "fgBlack",
            "bg": "bgYellow"
        }
    },
    "debug": {
        "tag" : {
            "fg": "fgGreen",
            "bg": "default"
        },
        "msg": {
            "fg": "fgGreen",
            "bg": "default"
        }
    },
    "info": {
        "tag" : {
            "fg": "fgBlack",
            "bg": "bgCyan"
        },
        "msg": {
            "fg": "fgBlack",
            "bg": "bgCyan"
        }
    },
    "warn": {
        "tag" : {
            "fg": "fgBrightMagenta",
            "bg": "default"
        },
        "msg": {
            "fg": "fgBrightMagenta",
            "bg": "default"
        }
    },
    "error": {
        "tag" : {
            "fg": "fgWhite",
            "bg": "bgBrightRed"
        },
        "msg": {
            "fg": "fgBrightRed",
            "bg": "default"
        }
    }
}
 ```
 Use the value `default` for no formatting. <br />
 The following is a list of values for the allowed colors. This list uses standard ANSI escape character colors.<br />
 [https://en.wikipedia.org/wiki/ANSI_escape_code#Colors](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors) 
 ```javascript
 /*
 * Available Foreground Colors
 */
fgBlack
fgRed
fgGreen
fgYellow
fgBlue
fgMagenta
fgCyan
fgWhite

/*
 * Available "Bright" Foreground Colors
 */
fgBrightBlack
fgBrightRed
fgBrightGreen
fgBrightYellow
fgBrightBlue
fgBrightMagenta
fgBrightCyan
fgBrightWhite

/*
 * Available Background Colors
 */
bgBlack
bgRed
bgGreen
bgYellow
bgBlue
bgMagenta
bgCyan
bgWhite

/*
 * Available "Bright" Background Colors
 */
bgBrightBlack
bgBrightRed
bgBrightGreen
bgBrightYellow
bgBrightBlue
bgBrightMagenta
bgBrightCyan
bgBrightWhite
 ``` 
