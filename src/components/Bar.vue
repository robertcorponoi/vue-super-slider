<template>
  <div class="vue-super-slider-bar" ref="bar"></div>
</template>

<script>
export default {
  name: "VueSuperSliderBar",
  props: {
    /**
     * The color to use for the bar's background.
     */
    barColor: String,

    /**
     * The color to use for the bar's active background.
     */
    barColorActive: String,
  },
  methods: {
    /**
     * Sets the background of the bar depending on the active range selected.
     * 
     * @param {number} rangeStart The start of the currently selected range of the slider.
     * @param {number} rangeEnd The end of the currently selected range of the slider.
     */
    setRangeBackground(rangeStart, rangeEnd) {
      this.$refs.bar.style.background = `linear-gradient(to right, ${this.barColor} 0%, ${this.barColor} ${rangeStart}%, ${this.barColorActive} ${rangeStart}%, ${this.barColorActive} ${rangeEnd}%, ${this.barColor} ${rangeEnd}%, ${this.barColor} 100%)`;
    }
  }
};
</script>

<style lang="scss">
.vue-super-slider-bar {
  width: 100%;
  height: 0.3rem;
}
</style>