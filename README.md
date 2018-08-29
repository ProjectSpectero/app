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

```bash
npm run build-%environment%
```

Where %enviroment% is either `dev`, `staging` or `production`.

## Previewing a build locally

The dist directory is meant to be served by an HTTP server (unless you've configured baseUrl to be a relative value), so it will not work if you open dist/index.html directly over file:// protocol. The easiest way to preview your production build locally is using a Node.js static file server, for example serve:

```bash
npm i -g serve
npm run build-%environment%
serve -s dist
```