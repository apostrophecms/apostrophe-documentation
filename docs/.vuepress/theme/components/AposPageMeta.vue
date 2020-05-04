<template>
  <div v-if="editOrIssueLinks" class="meta">
    <EditOrIssue />
    <p class="meta-updated">
      Last updated: {{$page.lastUpdated}}
    </p>
  </div>
</template>

<script>
import EditOrIssue from './EditOrIssue.vue'

export default {
  name: 'AposPageMeta',
  components: {
    EditOrIssue
  },
  props: {
    editOrIssueLinks: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 2rem 0 1rem;
  font-size: 90%;
}

.meta-updated {
  margin: 0;
  padding: 0;
}
</style>