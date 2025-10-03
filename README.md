This is the minimal set of files for a "progressive web app" to be installable on Android and iOS.

It contains the smallest possible `manifest.json` and service worker to trigger the install flow on Chrome.

An even smaller implementation that fits in a single HTML file is in [single-file-pwa.html](./single-file-pwa.html). It has a manifest.json that is dynamically generated from JavaScript, and it is installable without a service worker.

## Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that publishes the contents of the project root to GitHub Pages. Pushes to the `main` branch (or manual runs via the workflow dispatch) will build the site and deploy it.

To get the site live:
1. In your repository, open **Settings → Pages** and select **GitHub Actions** as the source.
2. Push to `main` (or re-run the latest deployment workflow) and wait for the `Deploy to GitHub Pages` job to finish.

Once complete, GitHub will expose the PWA at your repository's Pages URL, for example `https://<username>.github.io/<repository>/`.
