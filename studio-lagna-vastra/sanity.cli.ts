import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'p0wrf5zn',
    dataset: 'production'
  },
  studioHost: 'lagnavastra',
  deployment: {
    appId: 'o8b4rco2wutxuzswi4qhreo7',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})


