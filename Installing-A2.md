### Installing an A2 Development Environment

This tutorial will explain how to set up your Apostrophe 2 development environment on a Mac with any recent version of OS X. It lists all technical dependencies and is appropriate for developers without previous experience with the command line or node.js.

We'll be installing the following tools:
- `Xcode` for the various utilities that come with it
- `Homebrew` for easy download and installation of software packages
- `git` for version control
- `node` and `npm` for running the server and managing node packages
- `mongo` for the database
- `imagemagick` for command-line image resizing and cropping

These are the technical requirements for Apostrophe 2. In addition a nice code editor like [Sublime Text](http://www.sublimetext.com/3) goes a long way, as does a Terminal extension like [TotalTerminal](http://totalterminal.binaryage.com/) or [iTerm](http://www.iterm2.com/#/section/home).

-

### Install Xcode

Xcode can be installed from the App store. We recommend installing Xcode Command Line Tools as well, which is available in Xcode -> Preferences ... -> Downloads.

### Install [Homebrew](http://brew.sh/)

Open up a new Terminal window and run this command:

`ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go/install)"`

Now you have homebrew, which can be accessed using the `brew` command in Terminal.

### [Git](http://git-scm.com/)

`brew install git`

### Install [Node](http://nodejs.org/) & [NPM](https://npmjs.org/)

`brew install node`

We'll need to add node's directory to our $PATH in order for it to work its magic. Create a bash profile if you don't have one already, and then open it in TextEdit:
`touch ~/.profile && open ~/.profile`

In this new file, add these two lines:
```bash
export NODE_PATH="/usr/local/lib/node"
export PATH="/usr/local/share/npm/bin:$PATH”
```

You should verify that this worked by opening a new Terminal tab and running:
`echo $PATH`

It should echo the path that you added as a set of colon-separated values.

NPM should have been installed with Node, but we'll check to make sure. Try:
`npm`

and if you get a 'not found' kind of error, run this:
`curl https://npmjs.org/install.sh | sh`

### [Mongo](http://www.mongodb.org/)

`brew install mongo`

During the mongo install, it will print out instructions for starting mongo on login (recommended for developers), which should look like this:
```
==> Caveats
To have launchd start mongodb at login:
    ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
Then to load mongodb now:
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
Or, if you don't want/need launchctl, you can just run:
    mongod
```

Run those, open a new tab and try:
`mongo`

It should start an interactive mongo prompt. ctrl+c to exit.

[ImageMagick](http://www.imagemagick.org/script/index.php)
-----------
`brew install imagemagick`

-

That's everything you need to get started. The next tutorial covers starting a new Apostrophe 2 project.