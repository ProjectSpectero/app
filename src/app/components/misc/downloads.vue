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
        <section class="step section padded">
          <h2>{{ osTab }} Instructions</h2>
          <div class="step-1">
            <div class="details">
              <h5 class="mb-0">Download Spectero Daemon</h5>
            </div>
          </div>
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
            <p>
              You may opt for a non-interactive background installation with default values by providing the <span class="cmd">--agree --install</span> arguments. Full list of installer arguments is <a
                target="_blank"
                href="https://spectero.atlassian.net/wiki/spaces/docs/pages/3244075/Linux+macOS+Installer+Arguments">
                available here.
              </a>
            </p>
          </template>
        </section>

        <section class="step section padded">
          <div class="step-2">
            <div class="details">
              <h5 class="mb-0">Connect to Spectero Cloud</h5>
            </div>
          </div>
          <p>Open a CLI shell, then run the following command to add the daemon to the Spectero Cloud:</p>
          <p class="cmd">spectero cli connect {{ (nodeKey !== null) ? nodeKey : '&lt;your node key&gt;' }}</p>
          <p v-if="nodeKey === null">Please <router-link :to="{ name: 'login', query: { redirect: '/settings/keys' } }">log in</router-link> or <router-link :to="{ name: 'register' }">register</router-link> to obtain your node key.</p>
        </section>

        <section class="step section padded">
          <div class="step-3">
            <div class="details">
              <h5 class="mb-0">You're done!</h5>
            </div>
          </div>
          <p>Once you've ran the connect command to link the daemon to Spectero Cloud, check your email inbox to complete the setup process.</p>
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

          <div class="separator"/>

          <section v-if="osTab === 'Windows'">
            <h5>Windows 10 Users</h5>
            <p>Microsoft .NET Framework v3.5 may be required as an installation dependency if you are running Windows 10.</p>
            <p>If you are prompted to install .NET Framework v3.5 upon launching the installer, please <strong>re-run the installer after the installation completes</strong> to finish the installation process.</p>
          </section>
          <section v-else>
            <h5>Deployments on Cloud Providers</h5>
            <p>Planning to deploy Spectero to a cloud provider such as DigitalOcean or Vultr? Please review our <a
              target="_blank"
              href="https://spectero.atlassian.net/wiki/spaces/docs/pages/5275651/Cloud+Provider+Advisories">Cloud Provider Advisories</a> document first.</p>
          </section>

          <div class="separator"/>

          <section v-if="matrices">
            <h5>Compatibility</h5>
            <p>The Spectero Daemon is currently compatible with the following {{ osTab }} {{ osTab === 'Linux' ? 'distributions' : 'versions' }}:</p>
            <div class="compatibility">
              <div class="matrices">
                <div
                  v-for="(os, j) in matrices[osTab]"
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
                    <h6 class="title-distro">{{ j }}</h6>
                    <div
                      v-for="(distro, k) in os"
                      :key="k"
                      class="os-item">
                      <p>{{ k }}</p>
                      <span
                        v-if="distro.tested !== undefined"
                        :class="{ 'compatible': distro.tested === true }"
                        class="compatibility-icon"><p>{{ (distro.tested === true) ? 'Tested' : 'Untested' }}</p></span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>
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
