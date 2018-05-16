<template>
  <div class="downloads">
    <top title="Downloads"></top>
    <section>
      <h5>Step 1</h5>
      <p>Please install the .NET Core (>= 2.0) Runtime on your target system. Use the buttons below for download and install instructions related to your platform:</p>
      <p>
        <a class="button" href="https://www.microsoft.com/net/download/Windows/run#" target="_blank">Windows Instructions</a>
        <a class="button" href="https://www.microsoft.com/net/download/linux/run#" target="_blank">Linux Instructions</a>
        <a class="button" href="https://www.microsoft.com/net/download/macos/run#" target="_blank">macOS Instructions</a>
      </p>
      <p>We are planning on automating this step in the future.</p>
    </section>
    <section>
      <h5>Step 2</h5>
      <p>Please download the latest release of the Spectero Daemon and its CLI.</p>
      <template v-if="loaded">
        <a v-if="latest" class="button button-info" :href="latest" target="_blank">Download Now</a>
        <a v-if="alt" class="button" :href="alt" target="_blank">Alternate Download</a>
        <div class="details">{{ version }} - <a v-if="changelog" :href="changelog" target="_blank">Changelog</a></div>
      </template>
      <template v-else>
        <button class="button button-loading" disabled>{{ $i18n.t('misc.LOADING') }}</button>
      </template>
    </section>
    <section>
      <h5>Step 3</h5>
      <p>We do not have multiplatform command wrappers available yet, thus to run the daemon:</p>
      <ol>
        <li>Please change your working dir into the `daemon` directory with `cd` (or your OS equivalent)</li>
        <li>Please run `ASPNETCORE_ENVIRONMENT=Production dotnet daemon.dll`. On firstrun, the daemon will set itself up (and share its Administrator password with you in the active console. Please take note of this.)</li>
        <li>
          If you'd like to connect the daemon to the Spectero P2P market for easier management / bandwidth sales, please run the CLI:
          <ol>
            <li>Change dirs into the `cli` dir and run `dotnet Spectero.daemon.CLI.dll`.</li>
            <li>This will open an interactive shell, please type `help` there or look at the documentation for further guidance.</li>
          </ol>
        </li>
      </ol>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import top from '@/shared/components/top'

export default {
  components: {
    top
  },
  metaInfo: {
    title: 'Downloads'
  },
  data () {
    return {
      loaded: false,
      latest: null,
      alt: null,
      version: null
    }
  },
  methods: {
    async fetchDownloadInfo () {
      try {
        const response = await axios({
          method: 'GET',
          url: 'https://spectero.com/releases.json',
          timeout: 10000
        })

        if (response) {
          let data = response.data
          let channel = data.channels.stable
          let release = data.versions[channel]

          this.version = channel
          this.latest = release.download
          this.alt = release.altDownload
          this.changelog = release.changelog

          this.loaded = true
        }
      } catch (e) {
        let error = e.response
        this.$toasted.error(this.$i18n.t(`errors.RELEASES_FETCH_FAILED`))
        console.error('Failed to fetch release data:', error)
      }
    }
  },
  created () {
    this.fetchDownloadInfo()
  }
}
</script>

<style lang="scss" scoped>
section {
  padding: $pad;
  margin-bottom: $pad;
  border: 1px solid $color-border;
  border-radius: 5px;

  p {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
h5 {
  margin-bottom: 12px;
  color: $color-light;
  font-size: 14px;
  text-transform: uppercase;
}
ol {
  margin-left: 20px;
  line-height: 140%;

  li {
    margin-bottom: 10px;
    padding-left: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
li > ol {
  margin-top: 12px;
  list-style: lower-alpha;

  li {
    margin-bottom: 6px;
  }
}
.details {
  display: block;
  margin-top: $pad;
}
</style>
