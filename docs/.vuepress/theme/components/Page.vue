<template>
  <main class="page">
    <article>
      <slot name="top" />
      <Content class="theme-default-content" />
      <footer class="page-footer">
        <AposFeedback />
        <AposPageMeta :editOrIssueLinks="true" />
      </footer>
      <PageNav v-bind="{ sidebarItems }" />
      <slot name="bottom" />
    </article>
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'
import AposFeedback from './AposFeedback.vue'
import AposPageMeta from './AposPageMeta.vue'

export default {
  components: {
    PageEdit,
    PageNav,
    AposFeedback,
    AposPageMeta
  },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page {
  padding-bottom: 2rem;
  display: block;
}

.page-footer {
  @extend $wrapper;
  padding-bottom: 0;
}
</style>
