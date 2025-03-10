import Vue from "vue";

export default function (ctx) {
  const sectionsConfig = ctx.$config.sections
  Vue.prototype.$sections = {
    projectId: sectionsConfig.projectId,
    projectUrl: sectionsConfig.projectUrl,
    serverUrl: (sectionsConfig.environment === "testing" ? "https://api.sections-saas.k8s-dev.geeks.solutions/api/v1" : "https://sections.geeks.solutions/api/v1"),
    queryStringSupport: sectionsConfig.queryStringSupport,
    projectLocales: sectionsConfig.projectLocales,
    wysiwygEditorOptions: sectionsConfig.wysiwygEditorOptions,
    cname: sectionsConfig.cname,
    cssPreset: sectionsConfig.cssPreset
  }
  ctx.$sections = Vue.prototype.$sections
}
