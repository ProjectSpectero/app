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
    <section v-if="matrices" class="matrices">
      <h5>Compatibility Matrices</h5>

      <div v-for="(matrix, i) in matrices" :key="i">
        <h4 class="title">{{ i }}</h4>

        <div v-for="(os, j) in matrix" :key="j">
          <div v-if="os.Distributions">
            <div class="subtitle">{{ j }}</div>
            <table>
              <tbody>
                <tr v-for="(distro, k) in os.Distributions" :key="k">
                  <td>{{ k }}</td>
                  <td>
                    <span v-if="distro.tested !== undefined">
                      <span v-if="distro.tested" class="icon-check"></span>
                      <span v-else class="icon-x"></span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <table v-else>
            <tbody>
              <tr>
                <td>{{ j }}</td>
                <td>
                  <span v-if="os.tested !== undefined">
                    <span v-if="os.tested" class="icon-check"></span>
                    <span v-else class="icon-x"></span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import top from '@/shared/components/top'

export default {
  metaInfo: {
    title: 'Downloads'
  },
  data () {
    return {
      loaded: false,
      latest: null,
      alt: null,
      version: null,
      matrices: null
    }
  },
  created () {
    this.fetchDownloadInfo()
    this.fetchMatrices()
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
        console.error('Failed to fetch release data:', e.response)
        this.$toasted.error(this.$i18n.t(`errors.RELEASES_FETCH_FAILED`))
      }
    },
    async fetchMatrices () {
      try {
        const response = await axios({
          method: 'GET',
          url: 'https://raw.githubusercontent.com/ProjectSpectero/daemon-installers/master/COMPATABILITY.json',
          timeout: 10000
        })

        if (response && response.data) {
          this.matrices = response.data
        }
      } catch (e) {
        console.error('Failed to fetch matrices data:', e.response)
        this.$toasted.error(this.$i18n.t(`errors.MATRICES_FETCH_FAILED`))
      }
    }
  },
  components: {
    top
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

  &.matrices {
    .title {
      margin: 1rem 0;
    }

    .subtitle {
      margin: 1rem 0;
      text-decoration: underline;
    }

    table {
      min-width: 20%;

      td {
        border: 1px solid $color-border;
        padding: 1.5rem;
        background: #fff;

        &:first-child {
          width: 180px;
        }

        &:last-child {
          text-align: center;
        }
      }
    }

    .icon-check {
      color: $color-success;
    }

    .icon-x {
      color: $color-danger;
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
