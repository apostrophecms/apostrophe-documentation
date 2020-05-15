<template>
  <div class="theme-container">
    <div class="theme-default-content">
      <h1>404</h1>
      <p>
        <strong>That wasn't ideal. 😕</strong>
      </p>
      <p>
        We recently change our documentation platform. If you got here from an internet search or link that was previously working, please bear with us as we work out redirects. The search field should get you where you need to go. 🔎
      </p>
      <RouterLink to="/">
        Return home.
      </RouterLink>
    </div>
  </div>
</template>

<script>
const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>
