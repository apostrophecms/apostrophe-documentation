<template>
  <!-- Based on https://github.com/ipfs/ipfs-docs-v2/blob/master/docs/.vuepress/theme/components/Feedback.vue -->
  <div class="c-feedback">
    <h3>{{ titleTxt }}</h3>
    <div v-if="!voteSubmitted" class="feedback-actions">
      <button :title="yesTxt" v-on:click="sendFeedback(evtYes)">
        {{ yesTxt }}
      </button>
      <button :title="noTxt" v-on:click="sendFeedback(evtNo)">
        {{ noTxt }}
      </button>
    </div>
    <div v-if="voteSubmitted" class="feedback-result">
      <p>{{ thanksTxt }}</p>
    </div>
    <div v-if="editOrIssueLinks" class="feedback-edit-or-issue">
      <EditOrIssue />
    </div>
  </div>
</template>

<script>
import EditOrIssue from './EditOrIssue.vue'

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
      default: 'Thank you for the feedback.'
    },
    evtYes: {
      type: String,
      default: 'yes'
    },
    evtNo: {
      type: String,
      default: 'no'
    },
    yesTxt: {
      type: String,
      default: 'Yes'
    },
    noTxt: {
      type: String,
      default: 'No'
    },
    editOrIssueLinks: {
      type: Boolean,
      default: true
    }
  },
  components: {
    EditOrIssue
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

button {
  border-width: 0;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  justify-content: center;
  padding: 20px 50px 20px;
  border-radius: 5px;
  color: #fff;
  background-color: #4D4D4D;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  @include t/ransition(all);  line-height: 0.9;
}

.feedback-edit-or-issue {
  padding: 1em 0;
}

.c-feedback {
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
  justify-content: center;

  button {
    flex: 1;
  }
}

@media (min-width: $MQMobile) {
  .illustration {
    width: 40%;
    float: right;
  }

  .feedback-actions {
    display: block;
  }
}
</style>
