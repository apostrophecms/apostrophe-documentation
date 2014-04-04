---
title: "Create your own project, separate from the sandbox"
---

You can easily create your own open source or private Apostrophe project using apostrophe-sandbox as a starting point. Here's how we do it (supposing the project name is `myproject`):

1. Go to github.com (or any other provider of your choice) and create a new, empty repository called `myproject`, or whatever suits you. Do not add any files to it yet. If you want a private, non-open-source project, make sure you select that option. For this example we'll assume to be working on github (`myaccount/myproject.git`).

2. Clone the `apostrophe-sandbox` repository to your computer, naming the resulting folder `myproject` (just for example):

```bash
git clone https://github.com/punkave/apostrophe-sandbox.git myproject
```

3. Update the remote origin (to be able to push your future work to **your** repository):

```bash
git remote set-url origin git@github.com:myaccount/myproject.git
```

   You can then check the remote has been properly set by issuing `git remote -v` and looking at the output.

4. Edit the `package.json` file to reflect your project a little better. This is less important for node apps than it is for reusable modules, but you may as well be thorough. Make sure you keep the `dependencies` section.

5. *Edit `app.js` and change the `shortname` setting*. Otherwise, you'll use the same database for all of your projects, and it will be called `apostrophe-sandbox`. And that's not good, right?

6. Commit your changes to `package.json`:

```bash
git add package.json
git commit
```

7. Push your work to github (to our new origin `myaccount/myproject.git`):

```bash
git push origin master
```

Boom! You're done. You now have your own Apostrophe project in github, based on `apostrophe-sandbox` as a starting point.

(Remember that you don't actually have to use github to perform these steps. You can do exactly the same thing with Beanstalk and other git hosting providers.)

### Next Steps

[Editing existing page templates](editing-existing-page-templates.html)
