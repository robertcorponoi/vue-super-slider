<template>
  <div class="vue-super-slider-handle"></div>
</template>

<script>
export default {
  name: "VueSuperSliderHandle",
  props: {
    /**
     * Indicates which slider handle this is (min or max).
     */
    type: String,
  },
  data() {
    return {
      /**
       * Indicates whether this handle is actively being dragged or not.
       * 
       * @property {boolean}
       */
      active: false,

      /**
       * Keeps track of the previous x value of the handle.
       * 
       * @property {number}
       */
      previousX: 0,

      /**
       * The initial x position of the handle.
       * 
       * @property {number}
       */
      initialX: 0,

      /**
       * The current x position of the handle.
       * 
       * @property {number}
       */
      currentX: 0,

      /**
       * The x offset of the handle.
       * 
       * @property {number}
       */
      xOffset: 0,

      /**
       * The value that this handle is at.
       * 
       * @property {number}
       */
      value: 0,
    }
  }
};
</script>

<style lang="scss">
.vue-super-slider-handle {
  width: 1.75rem;
  height: 1.75rem;
  background: #fff;
  border: 1px solid #dadbdb;
  border-radius: 50%;
  cursor: pointer;
}
</style>