## Setting up the project

### Dependencies

* Make sure you have Vue CLI installed as a global dependency

```bash
npm install -g @vue/cli
```

* Download / update packages

```bash
npm update
```

## Local development

After setting up everything, you just need to run:

```bash
npm run dev
```

## Server deployment

* Configure any needed environment variables on DeployHQ. *All* variables must start with VUE_APP_ (except for NODE_ENV, but you don't need to specify that one, it's automatically derived from the build name). Example taken from the default .env:

```bash
VUE_APP_STRIPE_MODE=sandbox
VUE_APP_STRIPE_SANDBOX_PUBLIC_KEY=stripekey
VUE_APP_STRIPE_LIVE_PUBLIC_KEY=null
VUE_APP_GOOGLE_ANALYTICS_ID=dev
VUE_APP_GOOGLE_RECAPTCHA_KEY=dev
```

* Run the following command (where %enviroment% is either `dev`, `staging` or `production`):

```bash
npm run build-%environment%
```


## Previewing a build locally

The dist directory is meant to be served by an HTTP server (unless you've configured baseUrl to be a relative value), so it will not work if you open dist/index.html directly over file:// protocol. The easiest way to preview your production build locally is using a Node.js static file server, for example serve:

```bash
npm i -g serve
npm run build-%environment%
serve -s dist
```