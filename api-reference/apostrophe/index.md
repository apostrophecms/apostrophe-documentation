---
title: apostrophe: core CMS services
children:
  - files
---

## Overview

This module provides core services needed by every site, such as files, document storage, template rendering, video, and the core widgets.

All methods documented here, both on the server side and on the browser side, are methods of the `apos` object.

On the server side this object is available in `app.js` as `site.apos`. It is passed to every module as `options.apos`. The convention is to set `self._apos` to `options.apos` in your module.

On the browser side the `apos` object is global.

## Core services

Functions for each of these core services are part of the `apos` object, and are documented separately below.

### [Files](files)

Services related to files, such as images and office documents.

### Assets (TODO)

Services related to the delivery of JavaScript, stylesheets and DOM templates to the browser.
