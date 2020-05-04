<template>
  <!-- Based on https://github.com/ipfs/ipfs-docs-v2/blob/master/docs/.vuepress/theme/components/Feedback.vue -->
  <div class="feedback">
    <h3>{{ titleTxt }}</h3>
    <div v-if="!voteSubmitted" class="feedback-actions">
      <button class="feedback-button" :title="yesTxt"
        v-on:click="sendFeedback(evtYes)"
      >
        <span>{{ yesTxt }}</span>
      </button>
      <button class="feedback-button ":title="noTxt"
        v-on:click="sendFeedback(evtNo)"
      >
        <span>{{ noTxt }}</span>
      </button>
    </div>
    <div v-if="voteSubmitted" class="feedback-result">
      <p>{{ thanksTxt }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AposFeedback',
  data: function() {
    return {
      voteSubmitted: false,
      currentPath: this.$route.path
    }
  },
  methods: {
    sendFeedback: function(evtType) {
      this.voteSubmitted = true;
      console.log(evtType);

      if (!window.ga) {
        return;
      }

      window.ga('send', 'event', {
        eventCategory: evtType,
        eventAction: 'click',
        eventLabel: this.currentPath
      });
    }
  },
  watch: {
    '$route.path': function(path) {
      this.voteSubmitted = false
      this.currentPath = path
    }
  },
  props: {
    titleTxt: {
      type: String,
      default: 'Was this information helpful?'
    },
    thanksTxt: {
      type: String,
      default: 'Thank you for your feedback.'
    },
    evtYes: {
      type: String,
      default: 'helpful'
    },
    evtNo: {
      type: String,
      default: 'unhelpful'
    },
    yesTxt: {
      type: String,
      default: 'Yes'
    },
    noTxt: {
      type: String,
      default: 'No'
    }
  }
}
</script>

<style lang="stylus" scoped>
@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.feedback {
  padding: 0rem 2.5rem;

  &-result {
    animation: fadein 0.5s;
    min-height: 38px;
    display: flex;
    align-items: center;

    * {
      margin: 0;
    }
  }
}

.feedback-actions {
  display: flex;
  flex-direction: column;

  .feedback-button:last-child {
    margin-top: 0.5rem;
  }

  @media (min-width: $MQMobileNarrow) {
    display: block;

    .feedback-button:last-child {
      margin-top: 0;
    }
  }
}

.feedback-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20px 50px 20px;
  border-width: 0;
  border-radius: 5px;
  background-color: $textColor;
  font-size: 16px;
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-decoration: none;
  color: #fff;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s;

  > span {
    display: inline-block;
    border-style: solid;
    border-width: 1px 0;
    border-color: transparent;
  }

  &:hover, &:focus, &.is-hover {
    background-color: #000;

    span {
      border-bottom: 1px solid #fff;
    }
  }
}
</style>
