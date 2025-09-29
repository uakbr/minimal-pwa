This is the minimal set of files for a "progressive web app" to be installable on Android and iOS.

It contains the smallest possible `manifest.json` and service worker to trigger the install flow on Chrome.

An even smaller implementation that fits in a single HTML file is in [single-file-pwa.html](./single-file-pwa.html). It has a manifest.json that is dynamically generated from JavaScript, and it is installable without a service worker.
