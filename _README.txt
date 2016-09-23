I've updated the apostrophe-documentation project to use our shiny static site generator.

The github project is here:

https://github.com/punkave/apostrophe-documentation

And you can see the current build of the docs site here:

http://docs.apostrophenow.org

Contributing is really easy.

REQUIREMENTS

Install the static site generator:

npm install -g habit

Clone the project:

git clone https://github.com/punkave/apostrophe-documentation

HOW TO CONTRIBUTE

Now you can work on the nunjucks layouts in _layouts, write actual HOWTOs in the howtos folder (use markdown and a .md file extension), and contribute LESS in the stylesheets folder (main.less is what actually gets compiled, everything else should be imported). Any files that aren't markdown or LESS get copied straight to the site, unless they are in a folder starting with _.

Please note: it's up to you to link to your HOWTOs in the index.md file. We want them in a considered order anyway.

HOW TO SWITCH LAYOUTS

If you don't want your page to use the _layouts/default.html layout, you can specify that with a special comment in your
Markdown file with *THREE DASHES*:

<!--- layout: home -->

Now your page gets rendered with foo.html instead of default.html. I've done this in index.md for instance. Yes, layouts can extend each other and override blocks in the usual Nunjucksian way.

MAKING LINKS THAT DON'T BREAK

*ALWAYS* write relative links, or use {{ root }} instead of / to refer to the root. NEVER just write /images/foo.png. Write {{ root }}images/foo.png instead.

TESTING

To see your work locally, type:

./view

That will compile your site and open it in your browser.

DEPLOYING

To deploy your work to docs.apostrophenow.org, just do:

./deploy

Make sure you commit and push your work of course.

BOOM!

## Regenerating the api docs

The `docs/modules` folder is generated from the Apostrophe source code.

First install the dependencies of the doc generator app:

```
cd _api-reference-generator
npm install
mkdir -p data
brew install phantomjs
```

Now you can regenerate the `docs/modules` folder:

```
./generate
```

`./generate` ends by running `habit` for you. It takes a few seconds because it's doing some fancy things to get information about all of the moog types.

If you need to document a newer version of Apostrophe you will want to `npm update` in the reference generator app folder.

