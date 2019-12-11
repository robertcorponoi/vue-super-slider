<template>
  <div class="vue-super-slider">
    <img v-if="sliderOptions.background" class="vue-super-slider__background" :src="sliderOptions.background" />
    <div class="vue-super-slider__main" ref="slider">
      <handle type="min" id="handleMin" ref="handleMin"></handle>
      <handle type="max" id="handleMax" ref="handleMax"></handle>
      <bar ref="bar" :barColor="sliderOptions.barColor" :barColorActive="sliderOptions.barColorActive"></bar>
    </div>
    <div class="vue-super-slider__info" ref="info">
      <span ref="infoMin">{{ `${sliderOptions.prefix } ${this.currentMin}` }}</span>
      <span ref="infoMax">{{ `${sliderOptions.prefix } ${this.currentMax}` }}</span>
    </div>
  </div>
</template>

<script>
import Bar from "./Bar.vue";
import Handle from "./Handle.vue";

export default {
  name: "VueSuperSlider",

  props: {
    /**
     * The minumum value of the slider.
     */
    min: Number,

    /**
     * The maximum value of the slider.
     */
    max: Number,

    /**
     * Optional settings for the slider.
     */
    options: Object
  },

  components: {
    bar: Bar,
    handle: Handle
  },

  data() {
    return {
      /**
       * The default options for the slider.
       * 
       * @property {Object}
       */
      sliderOptions: {
        barColor: '#e5e5e5',
        barColorActive: '#42b883',
        background: null,
        prefix: ''
      },

      /**
       * The color to use for the bar's that isn't between the handles.
       * 
       * @property {string}
       */
      inactiveColor: this.options.barColor,

      /**
       * The color to use for the bar that's between the handles.
       * 
       * @property {string}
       */
      activeColor: this.options.barRangeColor,

      /**
       * The current width of the slider's bar.
       * 
       * @property {number}
       */
      barWidth: 0,

      /**
       * The current value for the minimum.
       * 
       * @property {number}
       */
      currentMin: this.min,

      /**
       * The current value for the maximum.
       * 
       * @property {number}
       */
      currentMax: this.max,

      /**
       * The current value for the minimum as a percentage.
       * 
       * @property {number}
       */
      currentMinPercent: 0,

      /**
       * The current value for the maximum as a percentage.
       * 
       * @property {number}
       */
      currentMaxPercent: 100,

      /**
       * Keeps track of the handle that was most recently dragged.
       * 
       * @property {*}
       */
      handleLastDragged: null,
    }
  },

  beforeMount() {
    this.setupOptions();
  },

  mounted() {
    this.setupBarProperties();

    this.setupInitialHandleValues();

    this.addSliderEventListeners();
  },

  methods: {
    /**
     * Sets up the initial properties of the slider by merging the user selected options with the default ones for
     * options not specified.
     */
    setupOptions() {
      Object.assign(this.sliderOptions, this.options);
    },

    /**
     * Sets up the data values based on the bar.
     * 
     * This is fired on mount and whenever the viewport size changes.
     */
    setupBarProperties() {
      this.barWidth = this.$refs.bar.$el.getBoundingClientRect().width;

      this.$refs.bar.setRangeBackground(this.currentMinPercent, this.currentMaxPercent);
    },

    /**
     * Sets up the initial handle values.
     */
    setupInitialHandleValues() {
      this.$refs.handleMin.value = this.currentMin;
      this.$refs.handleMax.value = this.currentMax;
    },

    /**
     * Adds the event listeners to the slider responsible for dragging the handles.
     */
    addSliderEventListeners() {
      window.addEventListener('mousedown', this.dragStart, false);
      window.addEventListener('touchstart', this.dragStart, false);

      window.addEventListener('resize', this.setupBarWidth);
    },

    /**
     * When the mouse is clicked or the screen is touched,
     * 
     * @param {Event} ev The mouse down or touch down event.
     */
    dragStart(ev) {
      window.addEventListener('mousemove', this.drag, false);
      window.addEventListener('touchmove', this.drag, false);
      
      const minHandleDragged = ev.target === this.$refs.handleMin.$el;
      const maxHandleDragged = ev.target === this.$refs.handleMax.$el;

      if (minHandleDragged) this.handleLastDragged = this.$refs.handleMin;
      else if (maxHandleDragged) this.handleLastDragged = this.$refs.handleMax;
      else return;

      if (ev.type == 'touchstart') this.handleLastDragged.initialX = ev.touches[0].clientX - this.handleLastDragged.xOffset;
      else this.handleLastDragged.initialX = ev.clientX - this.handleLastDragged.xOffset;

      this.handleLastDragged.active = true;

      let handleInitial;

      if (minHandleDragged) handleInitial = this.currentMin;
      else if (maxHandleDragged) handleInitial = this.currentMax; 

      this.$emit('sliderDragStart', this.handleLastDragged.type, handleInitial);
    },

    /**
     * When the mouse is clicked and dragged, 
     * 
     * @param {Event} ev The mouse move or touch move event.
     */
    drag(ev) {
      if (!this.handleLastDragged || !this.handleLastDragged.active) return;

      window.addEventListener('mouseup', this.dragEnd, false);
      window.addEventListener('touchend', this.dragEnd, false);

      ev.preventDefault();

      this.handleLastDragged.previousX = this.handleLastDragged.currentX;

      if (ev.type === 'touchmove') this.handleLastDragged.currentX = ev.touches[0].clientX - this.handleLastDragged.initialX;
      else this.handleLastDragged.currentX = ev.clientX - this.handleLastDragged.initialX;

      this.handleLastDragged.xOffset = this.handleLastDragged.currentX;

      let sliderDragAmount;

      const minHandleCollisionPoint = this.$refs.handleMin.$el.getBoundingClientRect().x + (this.$refs.handleMin.$el.getBoundingClientRect().width / 2);
      const maxHandleCollisionPoint = this.$refs.handleMax.$el.getBoundingClientRect().x - (this.$refs.handleMax.$el.getBoundingClientRect().width / 2);

      if (this.handleLastDragged.type === 'min') {
        const isMovingTowardsOtherHandle = this.$refs.handleMin.currentX > this.$refs.handleMin.previousX;

        const isHittingStartingBounds = this.$refs.handleMin.currentX < 0;
        const isHittingOtherHandle = minHandleCollisionPoint >= maxHandleCollisionPoint;

        if (isHittingStartingBounds || (isHittingOtherHandle && isMovingTowardsOtherHandle)) {
          this.$refs.handleMin.currentX = this.$refs.handleMin.previousX;

          return;
        }

        const barPosition = this.$refs.handleMin.currentX / this.barWidth;

        this.currentMin = Math.round(this.max * barPosition);

        this.currentMinPercent = Math.round(barPosition * 100) + 2;

        this.$refs.infoMin.textContent = `${this.sliderOptions.prefix} ${this.currentMin}`;

        sliderDragAmount = this.currentMin;
      } else if (this.handleLastDragged.type === 'max') {
        const isMovingTowardsOtherHandle = this.$refs.handleMax.currentX < this.$refs.handleMax.previousX;

        const isHittingStartingBounds = this.$refs.handleMax.currentX > 0;
        const isHittingOtherHandle = minHandleCollisionPoint >= maxHandleCollisionPoint;

        if (isHittingStartingBounds || (isHittingOtherHandle && isMovingTowardsOtherHandle)) {
          this.$refs.handleMax.currentX = this.$refs.handleMax.previousX;

          return;
        }

        const barPosition = (this.barWidth - Math.abs(this.$refs.handleMax.currentX)) / this.barWidth;

        this.currentMax = Math.round(this.max * barPosition);

        this.currentMaxPercent = Math.floor(barPosition * 100);

        this.$refs.infoMax.textContent = `${this.sliderOptions.prefix} ${this.currentMax}`;

        sliderDragAmount = this.currentMax;
      } else return;

      this.handleLastDragged.$el.style.transform = `translate(${this.handleLastDragged.currentX}px, -50%)`;

      this.$emit('valuesUpdated', this.currentMin, this.currentMax);

      this.$emit('sliderDrag', this.handleLastDragged.type, sliderDragAmount);

      this.$refs.bar.setRangeBackground(this.currentMinPercent, this.currentMaxPercent);
    },

    /**
     * When the mouse is clicked and let go of, calculate the value that it is at and then set the new min/max value.
     * 
     * After setting the value, we send out an event from the slider with the new min/max value.
     * 
     * @param {Event} ev The mouse up or touch end event.
     */
    dragEnd(ev) {
      if (!this.handleLastDragged) return;

      window.removeEventListener('mousemove', this.drag, false);
      window.removeEventListener('touchmove', this.drag, false);

      window.removeEventListener('mouseup', this.dragEnd, false);
      window.removeEventListener('touchend', this.dragEnd, false);

      const minHandleDragged = ev.target === this.$refs.handleMin;
      const maxHandleDragged = ev.target === this.$refs.handleMax;

      this.handleLastDragged.initialX = this.handleLastDragged.currentX;

      let barPosition;

      if (minHandleDragged) barPosition = this.handleLastDragged.currentX / this.barWidth;
      else if (maxHandleDragged) barPosition = (this.barWidth - Math.abs(this.handleLastDragged.currentX)) / this.barWidth;

      let handleEndValue;

      if (this.handleLastDragged.type === 'min') handleEndValue = this.currentMin;
      else if (this.handleLastDragged.type === 'max') handleEndValue = this.currentMax;

      this.$emit('sliderDragEnd', this.handleLastDragged.type, handleEndValue);

      this.$emit('valuesChanged', this.currentMin, this.currentMax);

      this.handleLastDragged.active = false;

      this.handleLastDragged = null;
    }
  }
};
</script>

<style lang="scss">
.vue-super-slider {
  &__background {
    width: 100%;
    position: relative;
    top: 0.25rem;
  }

  &__main {
    position: relative;

    #handleMin {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
    }

    #handleMax {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(0, -50%);
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
}
</style>