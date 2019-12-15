'use strict'

import { mount } from '@vue/test-utils';

import Bar from '../../src/components/Bar.vue';
import Handle from '../../src/components/Handle.vue';
import VueSuperSlider from '../../src/components/VueSuperSlider.vue';

describe('Slider Structure', () => {

  it('should have no image element since none was passed in the props', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          barColor: '#444',
          barColorActive: '#337ab7'
        }
      },
    });

    expect(wrapper.find('img').exists()).toBe(false);

  });

  it('should have an image element', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          barColor: '#444',
          barColorActive: '#337ab7',
          background: 'https://placehold.it/1000x50'
        }
      },
    });

    expect(wrapper.find('img').exists()).toBe(true);

  });

  it('should have two handles', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          barColor: '#444',
          barColorActive: '#337ab7',
        }
      },
    });

    expect(wrapper.find('#handleMin').is(Handle)).toBe(true) && expect(wrapper.find('#handleMax').is(Handle)).toBe(true);

  });

  it('should have slider info with no prefix', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        min: 5,
        max: 125,
        options: {
          barColor: '#444',
          barColorActive: '#337ab7',
        }
      },
    });

    expect(wrapper.find('.vue-super-slider__info').text()).toBe('5  125');

  });

  it('should have slider info with a prefix', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        min: 5,
        max: 125,
        options: {
          barColor: '#444',
          barColorActive: '#337ab7',
          prefix: '$'
        }
      },
    });

    expect(wrapper.find('.vue-super-slider__info').text()).toBe('$ 5 $ 125');

  });

  it('should set up the initial bar', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        min: 5,
        max: 125,
        options: {
          barColor: '#444',
          barColorActive: '#337ab7',
          prefix: '$'
        }
      },
    });

    expect(wrapper.find('.vue-super-slider-bar').is(Bar)).toBe(true);

  });

});

describe('Slider Events', () => {

  it('should emit the valuesChanged event', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          min: 5,
          max: 125,
          barColor: '#444',
          barColorActive: '#337ab7'
        }
      },
    });

    wrapper.vm.$emit('valuesChanged', 10, 125);

    expect(wrapper.emitted().valuesChanged).toEqual([[10, 125]]);

  });

  it('should emit the valuesUpdated event', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          min: 5,
          max: 125,
          barColor: '#444',
          barColorActive: '#337ab7'
        }
      },
    });

    wrapper.vm.$emit('valuesUpdated', 10, 105);

    expect(wrapper.emitted().valuesUpdated).toEqual([[10, 105]]);

  });

  it('should emit the sliderDragStart event', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          min: 5,
          max: 125,
          barColor: '#444',
          barColorActive: '#337ab7'
        }
      },
    });

    wrapper.vm.$emit('sliderDragStart', 'min', 15);

    expect(wrapper.emitted().sliderDragStart).toEqual([['min', 15]]);

  });

  it('should emit the sliderDrag event', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          min: 5,
          max: 125,
          barColor: '#444',
          barColorActive: '#337ab7'
        }
      },
    });

    wrapper.vm.$emit('sliderDrag', 'max', 110);

    expect(wrapper.emitted().sliderDrag).toEqual([['max', 110]]);

  });

  it('should emit the sliderDragEnd event', () => {

    const wrapper = mount(VueSuperSlider, {
      propsData: {
        options: {
          min: 5,
          max: 125,
          barColor: '#444',
          barColorActive: '#337ab7'
        }
      },
    });

    wrapper.vm.$emit('sliderDragEnd', 'min', 20);

    expect(wrapper.emitted().sliderDragEnd).toEqual([['min', 20]]);

  });

});