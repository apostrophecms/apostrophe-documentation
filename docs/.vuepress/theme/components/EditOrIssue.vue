<template>
  <div class="local-page-edit">
    <p class="local-edit-link" v-if="editLink">
      <a :href="editLink" target="_blank" rel="noopener noreferrer">{{
        editLinkText
      }}</a>
      <span v-if="$site.themeConfig.feedbackWidget.docsRepoIssue">
        on GitHub or
        <a :href="openIssueLink" target="_blank" rel="noopener noreferrer"
          >open an issue</a
        >
      </span>
    </p>
  </div>
</template>

<script>
export const endingSlashRE = /\/$/;
export const outboundRE = /^[a-z]+:/i;

export default {
  name: 'EditOrIssue',
  computed: {
    lastUpdated() {
      return this.$page.lastUpdated;
    },

    lastUpdatedText() {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated;
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated;
      }
      return 'Last Updated';
    },

    openIssueLink() {
      const { docsRepoIssue } = this.$site.themeConfig.feedbackWidget;
      return `https://github.com/${docsRepoIssue}/issues/new?assignees=&labels=OKR+3%3A+Content+Improvement%2C+docs-ipfs&template=documentation-issue.md&title=%5BDOCS+ISSUE%5D+Page:+${this.$page.title}`;
    },

    editLink() {
      const {
        repo,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      if (docsRepo && this.$page.relativePath) {
        return this.createEditLink(
          docsRepo,
          docsDir,
          docsBranch,
          this.$page.relativePath
        )
      }
      return null
    },

    editLinkText() {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    }
  },

  methods: {
    createEditLink(docsRepo, docsDir, docsBranch, path) {
      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`;
      return (
        base.replace(endingSlashRE, '') +
        `/edit` +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
        path
      );
    }
  }
}
</script>

<style lang="stylus" scoped>
.local-edit-link {
  margin: 0;
  padding: 0;
}
</style>
