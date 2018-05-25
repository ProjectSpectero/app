<template>
  <div class="downloads">
    <top title="Downloads"></top>
    <div class="container">
      <section class="section padded">
        <h5>Step 1</h5>
        <p>Please install the .NET Core (>= 2.0) Runtime on your target system. Use the buttons below for download and install instructions related to your platform:</p>
        <p>
          <a class="button" href="https://www.microsoft.com/net/download/Windows/run#" target="_blank">Windows Instructions</a>
          <a class="button" href="https://www.microsoft.com/net/download/linux/run#" target="_blank">Linux Instructions</a>
          <a class="button" href="https://www.microsoft.com/net/download/macos/run#" target="_blank">macOS Instructions</a>
        </p>
        <p>We are planning on automating this step in the future.</p>
      </section>
      <section class="section padded">
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
      <section class="section padded">
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
      <section v-if="matrices" class="section padded">
        <h4>Compatibility</h4>
        <p>The Spectero Daemon is currently compatible with the following platforms:</p>
        <div class="compatibility">
          <div v-for="(matrix, i) in matrices" :key="i" class="matrices-section">
            <h5 class="title-os">{{ i }}</h5>
            <div class="matrices">
              <div class="matrix" v-for="(os, j) in matrix" :key="j">
                <template v-if="os.Distributions">
                  <h6 class="title-distro">{{ j }}</h6>
                  <div v-for="(distro, k) in os.Distributions" :key="k" class="os-item">
                    <p>{{ k }}</p>
                    <span v-if="distro.tested !== undefined" class="compatibility-icon" :class="{ 'compatible': distro.tested === true }"></span>
                  </div>
                </template>

                <template v-else>
                  <div class="os-item">
                    <p>{{ j }}</p>
                    <span v-if="os.tested !== undefined" class="compatibility-icon" :class="{ 'compatible': os.tested === true }"></span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
@import '~@styles/components/icons';

section {
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

.compatibility {
  padding-top: 10px;

  .matrices {
    width: 100%;
    display: table;
    table-layout: fixed;

    .matrix {
      display: table-cell;
      border-right: 10px solid $white;

      &:last-of-type {
        border-right: none;
      }
    }
  }
  .matrices-section {
    margin-bottom: $pad;
    padding-bottom: $pad;
    border-bottom: 1px dashed $color-border;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: 0;
    }
  }
  .title-os {
    color: $color-primary;
  }
  .title-distro {
    margin: 0;
    margin: 4px 0 16px 0;
  }
  .os-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid $color-border;

    p {
      margin-bottom: 0;
      flex: 1;
    }
    .compatibility-icon {
      float: right;
    }
  }
  .compatibility-icon {
    font-size: 18px;

    &:after {
      @extend [class^="icon-"];
      @extend .icon-x:before;
      color: $color-danger;
    }
    &.compatible:after {
      @extend .icon-check:before;
      color: $color-success;
    }
  }
}
</style>
