---
title: Achieving PCI compliance with Apostrophe
---

These are notes from time spent getting one of our own sites to pass the PCI compliance scans of one PCI compliance vendor. These steps are in no way complete and we accept no responsibility whatsoever for the security of your site, or the lack thereof.

## Email security

If you have a mailserver such as postfix running on port 25, it probably isn't going to pass the PCI scans unless you spend quality time giving it a signed secure certificate and so on. You'll get lots of warnings and errors about this in the scan.

We recommend just [using postmark to send email](sending-email.html) from Apostrophe. If you really want postfix in place to send certain messages, for instance error messages from cron jobs, you can [configure postmark to be the relay for your postfix mail server](http://support.postmarkapp.com/article/832-can-i-configure-postfix-to-send-through-postmark), in which case you can set `inet_interfaces` to `loopback-only` in `/etc/postfix/main.cf`, which will stop connections on port 25 except from the server itself. Don't forget to restart the postfix service.

## Webserver security

We assume you're [running nginx as a frontend proxy server](production.html). You will definitely need to set it up with HTTPS. In addition you'll need to redirect from the insecure site to the secure one, ideally for all URLs which is the simplest way to ensure the site is secure enough. This is super easy if you use [mechanic](https://github.com/punkave/mechanic).

In addition you will need to shut off the old `SSL` algorithms for secure connections, which are no longer secure. This is what that looks like in our nginx configuration files, in the `http` block:

```
# Stop POODLE attacks
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
```

## Send session cookies on secure requests only

For A2 0.5, in `data/local.js`, on the production server only, set the `sessionCore` option:

```javascript
// Secure logins only
sessionCore: {
  cookie: { httpOnly: true, secure: true, maxAge: null },
  proxy: true
}
```

For A2 0.6, you can also configure session overrides in `data/local.js`:

```javascript
modules: {
  'apostrophe-express': {
    sessions: {
      cookie: { httpOnly: true, secure: true, maxAge: null },
      proxy: true
    }
  }
}
```

Then restart Apostrophe.

This instructs your site to send session cookies only on `https` request so they can't be intercepted on an `http` request. `proxy: true` is only appropriate if you are using a frontend proxy like nginx to do the actual `https` work. Without it the site can't tell the request was secure and won't send any session cookies at all.

### Restrict access to port 3000

Also, by default Apostrophe will accept direct connections on its own port (usually 3000) from outside the local server, even when a reverse proxy is present. You will need to lock this down to prevent complaints that you still have an unsecured site, even if users are never directed to the site at that port.

Just create a `data/port` file on the server (the `data` folder is server specific and is never deployed), and populate it with one line:

`127.0.0.1`

Signaling that Apostrophe should only listen for connections from the reverse proxy running on the same server.

Now restart Apostrophe again.

## Code a secure site!

All of this is irrelevant if you do a sloppy job. Make sure all of your custom routes check the user's permissions, especially if they manipulate money. Always check whether the user has ownership of the thing they are trying to modify, and don't accept that ID from two places (for instance, a query parameter and a POST form parameter) in the same request; you'll forget to check ownership in at least one of those cases.

## Keep your system packages up to date

None of this does much good if your site is on an ancient Linux server on which no one ever types `yum update && yum upgrade`.
