# react-monocle [![Build Status](https://travis-ci.org/team-gryff/react-monocle.svg?branch=master)](https://travis-ci.org/team-gryff/react-monocle)

<img src="demo.gif" width="600"/>

React-Monocle is a developer tool for generating visual representations of your React app's component hierarchy.

### What it does
React-Monocle parses through your React components in order to generate a tree representing your component hierarchy. 
The tree is then diplayed along with a copy of your application. 
The rendered tree is synced up to the state(s) of your component, and as your app changes, our tree changes as well. 

### Setup
1. ```npm install -g react-monocle```
2. Navigate to the directory which contains your html file.
3. Run ```monocle -h <html> -b <bundle>```, where html points to your html, and bundle what your bundle file is named.
4. If more options are needed (ie if your React files are written in .js instead of .jsx), type ```monocle -h``` for more available options.

### Options
```
-e, --entry <entry>: App entry point. Defaults to JSX file where ReactDOM.render is found.
-d, --directory <directory>: directory of React files. Defaults to where Monocle was called.
-j, --extension <extension>: extension of React files (jsx or js). Defaults to .jsx (only use when specifying/in directory which has your React files!)
```

### Current Status
This open source project is currently in its alpha stage.  We will be actively updating its functionality in the next weeks.  Stay tuned!
If you find any bugs, please don't hesitate to open an issue or pull request!

### License
MIT

Copyright (c) 2016 Michael-Bryant Choa, Jenna Davis, Jerry Mao
