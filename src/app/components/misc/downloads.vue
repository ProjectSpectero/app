<template>
  <div class="downloads">
    <top title="Downloads">
      <ul
        slot="tabs"
        class="tabs os-tabs">
        <li
          v-for="(link, os) in downloadLinks"
          :key="os"
          :class="(osTab === os) ? 'active' : ''"
          @click.stop="switchTab(os)">{{ os }}</li>
      </ul>
    </top>

    <div class="container">
      <div class="col-12">
        <section class="section padded">
          <h2>{{ osTab }} Instructions</h2>
          <h5>Step 1</h5>
          <template v-if="osTab === 'Windows'">
            <p>Download the latest release of the Spectero Daemon and its CLI, then run it.</p>
            <a
              :href="downloadLinks[osTab]"
              class="button-info"
              target="_blank"><span class="icon-download"/> Download Now</a>
          </template>
          <template v-else>
            <p>Download and run the latest release of the Spectero Daemon and its CLI by running the following command:</p>
            <p class="cmd">wget -O install.sh {{ downloadLinks[osTab] }} && bash install.sh</p>
            <p>You may opt for a non-interactive background installation with default values by providing the <span class="cmd">--agree --install</span> arguments.</p>
            <p>
              A full list of installer arguments is <a
                target="_blank"
                href="https://spectero.atlassian.net/wiki/spaces/docs/pages/3244075/Linux+macOS+Installer+Arguments">
                available here.
              </a>
            </p>
          </template>
        </section>
        <section class="section padded">
          <h5>Installation Help</h5>
          <p>If you face any problems during installation, please refer to our documentation or GitHub repository by clicking the link below:</p>
          <a
            target="_blank"
            href="https://spectero.atlassian.net/wiki/spaces/docs/pages/491552"
            class="button">
            <span class="icon-help-circle" /> Installation Documentation
          </a>
          <a
            target="_blank"
            href="https://github.com/ProjectSpectero/"
            class="button-dark">
            <span class="icon-github" /> GitHub Repository
          </a>
        </section>
        <section class="section padded">
          <h5>Step 2</h5>
          <p>Open a CLI shell, then run the following command to add the daemon to the Spectero Cloud:</p>
          <p class="cmd">spectero cli connect {{ (nodeKey !== null) ? nodeKey : '&lt;your node key&gt;' }}</p>
          <p v-if="nodeKey === null">Please <router-link :to="{ name: 'login', query: { redirect: '/settings/keys' } }">log in</router-link> or <router-link :to="{ name: 'register' }">register</router-link> to obtain your node key.</p>
        </section>
        <section class="section padded">
          <h5>Step 3</h5>
          <p>Once you've connected the daemon to Spectero Cloud, visit our nodes management view to complete the setup process.</p>
          <router-link
            :to="{ name: 'nodes' }"
            class="button-success"><span class="icon-check"/> Complete Setup</router-link>
        </section>
        <section
          v-if="matrices"
          class="section padded">
          <h5>Compatibility</h5>
          <p>The Spectero Daemon is currently compatible with the following {{ osTab }} {{ osTab === 'Linux' ? 'distributions' : 'versions' }}:</p>
          <div class="compatibility">
            <div
              v-for="(matrix, i) in matrices"
              :key="i">
              <div
                v-if="i === osTab"
                class="matrices-section">
                <div class="matrices">
                  <div
                    v-for="(os, j) in matrix"
                    :key="j"
                    class="matrix">
                    <template v-if="os.Distributions">
                      <h6 class="title-distro">{{ j }}</h6>
                      <div
                        v-for="(distro, k) in os.Distributions"
                        :key="k"
                        class="os-item">
                        <p>{{ k }}</p>
                        <span
                          v-if="distro.tested !== undefined"
                          :class="{ 'compatible': distro.tested === true }"
                          class="compatibility-icon"><p>{{ (distro.tested === true) ? 'Tested' : 'Untested' }}</p></span>
                      </div>
                    </template>

                    <template v-else>
                      <div class="os-item">
                        <p>{{ j }}</p>
                        <span
                          v-if="os.tested !== undefined"
                          :class="{ 'compatible': os.tested === true }"
                          class="compatibility-icon"><p>{{ (os.tested === true) ? 'Tested' : 'Untested' }}</p></span>
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
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
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
      matrices: null,
      osTab: null
      // loaded: false,
      // latest: null,
      // alt: null,
      // version: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    nodeKey () {
      return (this.user) ? this.user.node_key : null
    },
    downloadLinks () {
      return {
        'Linux': process.env.DOWNLOAD_LINK_LINUX,
        'Windows': process.env.DOWNLOAD_LINK_WINDOWS
        // 'MacOS': process.env.DOWNLOAD_LINK_MACOS
      }
    }
  },
  created () {
    this.osTab = 'Linux'
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
.cmd {
  padding: 10px 14px;
  display: inline-block;
  color: #26FF6D;
  background: #28303A;
  font-family: monospace;
  word-break: break-all;
}
span.cmd {
  margin: 0 4px;
  padding: 2px 6px;
  color: #000;
  background: rgba(0,0,0,0.05);
  font-size: 95%;
}
</style>
