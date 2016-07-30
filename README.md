# react-monocle
[![Build Status](https://travis-ci.org/team-gryff/react-monocle.svg?branch=master)](https://travis-ci.org/team-gryff/react-monocle) [![npm version](https://badge.fury.io/js/react-monocle.svg)](https://badge.fury.io/js/react-monocle)

<img src="react/assets/logo.png" width="300"/>

</br>
**React Monocle** is a developer tool for generating visual representations of your React app's component hierarchy.

</br>
<img src="demo.gif" width="600"/>

## How It Works
React Monocle parses through your React source files to generate a visual tree graph representing your React component hierarchy. 
The tree is then displayed along with a live copy of your application. 
This is done by using your un-minified bundle file to inject wrapper functions around setState calls in order to have our tree display real-time feedback.
The rendered tree is synced up to the state(s) of your component using Redux, and as the state of your live app changes, the monocle tree graph will also provide visual feedback of data flow and state changes through the React components.

## Setup
**IMPORTANT** The way we use your bundle file requires so that the bundle is not mangled (ie not minified).

1. ```npm install -g react-monocle```
2. Navigate to the directory which contains your html file.
3. Type in ```monocle -h``` in order to find what options suit your needs the best. The only required option is specifying the bundle.


## Options

| Option     | Command           | Description                                                                                                                  |
-------------|-------------------|------------------------------------------------------------------------------------------------------------------------------|
| **Bundle** | **--bundle (-b)** | **Required** Path to React bundle file.                                                                                      |
| HTML       | --html (-c)       | HTML page which has your bundle and CSS files. Specify if you want CSS displayed and/or you are relying on external scripts. |
| Entry      | --entry (-e)      | App entry point. Defaults to JSX file where ReactDOM.render is found.                                                        |
| Directory  | --directory (-d)  | directory of React files. Defaults to where Monocle was called.                                                              |
| Extension  | --extension (-j)  | extension of React files (jsx or js). Defaults to .jsx (only use when specifying/in directory which has your React files!).  |

## Contributing/Testing

* Please feel free to fork and submit pull requests!
* After installing, you can run tests via ```npm run unit-tests``` or ```npm run test``` to run ESLint simultaneously
* Tests can be found in src/test and are currently broken out into: 
  1. astGeneratorTest.js
  2. d3DataBuilderTest.js
  3. iterTest.js
  4. previewParserTest.js
  5. reactParserTest.js
  6. test.js (to compile and run all tests at once)
* Please add new tests to relevant files specified above, or create new test files as needed.

## Coming Soon

* Demo
* Quick description of what goes on under the hood.
* Improving how we search for components

## In the Pipeline

* Support for React-Router
* Support for Redux



## Our Team
* Michael-Bryant Choa - [github.com/mbchoa](https://github.com/mbchoa)
* Jenna Davis - [github.com/jdavis218](https://github.com/jdavis218)
* Jerry Mao - [github.com/jerrymao15](https://github.com/jerrymao15)

## License
MIT

