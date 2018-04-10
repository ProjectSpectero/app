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
      <p>
        <a class="button button-info" href="https://spectero.com/latest.zip" target="_blank">Download Now</a>
        <a class="button" href="https://puu.sh/zQxAt/34a573891d.zip" target="_blank">Alternate Download Link</a>
      </p>
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
import top from '@/components/app/common/top'

export default {
  components: {
    top
  },
  metaInfo: {
    title: 'Downloads'
  },
  methods: {
    async fetchDownloadInfo () {
      try {
        const response = axios({
          method: 'GET',
          timeout: 10000,
          url: 'https://spectero.com/releases.json'
        })

        if (response) {
          console.log(response)
        }
      } catch (e) {
        let error = e.response
        console.error(error)
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
  font-weight: $font-bold;
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
</style>
