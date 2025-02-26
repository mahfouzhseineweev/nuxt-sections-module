<template>
  <div class="sub-types">
    <div>
      <div class="text-video" :class="{'content-wrapper': isSideBarOpen === false}" v-show="name">
        <TranslationComponent v-if="translationComponentSupport && locales.length > 1" :locales="locales" :default-lang="defaultLang" @setFormLang="(locale) => formLang = locale"/>
        <component :is="getComponentForm" :ref="name" :locales="locales" :selectedLang="formLang" :default-lang="defaultLang" :selected-media="selectedMedia" @openMediaModal="(mediaId, category) => $refs.sectionsMediaComponent.openModal(mediaId, category)" @closeMediaModal="$refs.sectionsMediaComponent.closeModal()" />
        <MediaComponent ref="sectionsMediaComponent" :sections-user-id="sectionsUserId" @emittedMedia="(media) => selectedMedia = media"></MediaComponent>
      </div>
    </div>
    <button
      class="mt-4 submit-btn"
      type="button"
      @click="sendJsonData"
      :class="{ withTabs }"
    >
      {{ $t('Submit data') }}
    </button>
    <button
        v-if="promoteButton"
        class="mt-4 submit-btn promote-btn"
        type="button"
        @click="$emit('promote-section')"
        :class="{ withTabs }"
    >
      {{ $t('promoteSection') }}
    </button>
  </div>
</template>

<script>
import { importComp } from "../../utils";
import TranslationComponent from "../../components/Translations/TranslationComponent";
import MediaComponent from "../../components/Medias/MediaComponent.vue";

export default {
  components: {
    MediaComponent,
    TranslationComponent
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    locales: {
      type: Array,
      default() {
        return ['en', 'fr']
      }
    },
    defaultLang: {
      type: String,
      default: 'en'
    },
    translationComponentSupport: {
      type: Boolean,
      default: false
    },
    sectionsUserId: {
      type: String,
      default: ''
    },
    promoteButton: {
      type: Boolean,
      default: false
    },
	isSideBarOpen: {
      type: Boolean,
      default: false
    },
	creationView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      withTabs: false,
      formLang: this.$i18n.locale.toString(),
      selectedMedia: null
    };
  },
  computed: {
    getComponentForm() {
      const path = "/forms/" + this.name;
      return importComp(path);
    },
  },
  mounted() {
    this.$root.$on("toggleWithTabs", (val) => {
      this.withTabs = val;
    });
    if (this.creationView) {
      this.$emit('creationViewLoaded', this.$refs[this.name].settings)
    }
  },
  methods: {
    sendJsonData() {
      const valid = this.$refs[this.name].validate();
      if (!valid) {
        return;
      }
      const settings = this.$refs[this.name].settings;
      this.$emit("addStatic", settings);
    },
  },
};
</script>
<style>
.sub-types button.submit-btn {
  border: none;
  font-size: 24px;

  padding: 7px;
  background: #31a9db;
  color: white;
  border-radius: 16px;
  transition: 0.2s;
  width: 385px;
  height: 70px;
  text-align: center;
}
.submit-btn.withTabs {
  margin-left: 14%;
}
.submit-btn.withTabs:hover {
  background-color: darken(#31a9db, 17%);
  transition: 0.2s;
}
.content-wrapper {
  overflow-y: scroll;
  height: 550px;
}
.promote-btn {
  font-size: 20px !important;
}
@media only screen and (max-height: 850px) {
  .content-wrapper {
    overflow-y: scroll;
    height: 450px;
  }
}
</style>
