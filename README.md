## Spectero

### Dependencies

* Make sure you have Vue CLI installed as a global dependency

```bash
npm install -g @vue/cli
```

* Download / update packages

```bash
npm update
```

### Local development

```bash
npm run dev
```

### Server deployment

```bash
npm run build-%environment%
```

Where %enviroment% is either `dev`, `staging` or `production`.