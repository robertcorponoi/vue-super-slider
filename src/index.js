'use strict'

import VueSuperSlider from './components/VueSuperSlider.vue';

/**
 * VueSuperSlider is an accessible and mobile friendly slider component that was inspired by Airbnb's 
 * rheostat slider.
 */
export default {

  /**
   * @param {Vue} Vue The Vue instance to bind this plugin to.
   */
  install(Vue) {

    /**
     * We need to add the VueSuperSlider component to the Vue instance.
     */
    Vue.component(VueSuperSlider);

  }

};

export { VueSuperSlider };