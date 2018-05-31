<template>
  <div class="downloads">
    <top title="Downloads"></top>

    <ul class="tabs os-tabs">
      <li v-for="(link, os) in downloadLinks" :key="os" @click.stop="switchTab(os)" :class="(osTab === os) ? 'active' : ''">{{ os }}</li>
    </ul>

    <div class="container">
      <section class="section padded">
        <h2>{{ osTab }} Instructions</h2>
        <h5>Step 1</h5>
        <template v-if="osTab === 'Windows'">
          <p>Download the latest release of the Spectero Daemon and its CLI.</p>
          <a class="button button-info" :href="downloadLinks[osTab]" target="_blank"><span class="icon-download"></span> Download Now</a>
        </template>
        <template v-else>
          <p>Download the latest release of the Spectero Daemon and its CLI by running the following command:</p>
          <p class="cmd">wget -q -O - {{ downloadLinks[osTab] }} | bash</p>
        </template>
      </section>
      <section class="section padded">
        <h5>Step 2</h5>
        <p>Open a CLI shell, then run the following command to add the daemon to the Spectero Cloud:</p>
        <p class="cmd">spectero cli connect {{ nodeKey }}</p>
      </section>
      <section class="section padded">
        <h5>Step 3</h5>
        <p>Once you've connected the daemon to Spectero Cloud, visit our nodes management view to complete the setup process.</p>
        <router-link :to="{ name: 'nodes' }" class="button button-success"><span class="icon-check"></span> Complete Setup</router-link>
      </section>
      <section v-if="matrices" class="section padded">
        <h4>Compatibility</h4>
        <p>The Spectero Daemon is currently compatible with the following {{ osTab}} versions:</p>
        <div class="compatibility">
          <div v-for="(matrix, i) in matrices" :key="i">
            <div v-if="i === osTab" class="matrices-section">
              <h5 class="title-os">{{ i }}</h5>
              <div class="matrices">
                <div class="matrix" v-for="(os, j) in matrix" :key="j">
                  <template v-if="os.Distributions">
                    <h6 class="title-distro">{{ j }}</h6>
                    <div v-for="(distro, k) in os.Distributions" :key="k" class="os-item">
                      <p>{{ k }}</p>
                      <span v-if="distro.tested !== undefined" class="compatibility-icon" :class="{ 'compatible': distro.tested === true }"><p>{{ (distro.tested === true) ? 'Tested' : 'Untested' }}</p></span>
                    </div>
                  </template>

                  <template v-else>
                    <div class="os-item">
                      <p>{{ j }}</p>
                      <span v-if="os.tested !== undefined" class="compatibility-icon" :class="{ 'compatible': os.tested === true }"><p>{{ (os.tested === true) ? 'Tested' : 'Untested' }}</p></span>
                    </div>
                  </template>
                </div>
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
import { mapGetters } from 'vuex'
import top from '@/shared/components/top'

export default {
  metaInfo: {
    title: 'Downloads'
  },
  data () {
    return {
      matrices: null,
      osTab: null
      // loaded: false,
      // latest: null,
      // alt: null,
      // version: null
    }
  },
  created () {
    this.osTab = 'Windows'
    this.fetchMatrices()
    // this.fetchDownloadInfo()
  },
  methods: {
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
    },
    switchTab (tabId) {
      this.osTab = tabId
    }
    // async fetchDownloadInfo () {
    //   try {
    //     const response = await axios({
    //       method: 'GET',
    //       url: 'https://spectero.com/releases.json',
    //       timeout: 10000
    //     })

    //     if (response) {
    //       let data = response.data
    //       let channel = data.channels.stable
    //       let release = data.versions[channel]

    //       this.version = channel
    //       this.latest = release.download
    //       this.alt = release.altDownload
    //       this.changelog = release.changelog

    //       this.loaded = true
    //     }
    //   } catch (e) {
    //     console.error('Failed to fetch release data:', e.response)
    //     this.$toasted.error(this.$i18n.t(`errors.RELEASES_FETCH_FAILED`))
    //   }
    // },
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    nodeKey () {
      return this.user.node_key
    },
    downloadLinks () {
      return {
        'Windows': process.env.DOWNLOAD_LINK_WINDOWS,
        'Linux': process.env.DOWNLOAD_LINK_LINUX,
        'MacOS': process.env.DOWNLOAD_LINK_MACOS
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
    display: flex;
    align-items: center;
    color: $color-danger;

    p {
      display: inline;
      font-size: 100%;
      font-weight: $font-semi;
    }
    &:after {
      @extend [class^="icon-"];
      @extend .icon-x:before;

      margin-left: 4px;
      font-size: 18px;
      line-height: 90%;
    }
    &.compatible {
      color: $color-success;

      &:after {
        @extend .icon-check:before;
      }
    }
  }
}
p.cmd {
  line-height: 38px;
  display: inline-block;
  padding: 0 14px;
  color: #26FF6D;
  background: #28303A;
  font-family: monospace;
}
</style>
