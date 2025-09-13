import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '../../src/components/Card.vue';

describe('Card Component', () => {
  it('renders properly', () => {
    const wrapper = mount(Card, {
      props: {},
      slots: {
        default: '<p>Test content</p>'
      }
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('accepts slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<p>Hello World</p>'
      }
    });
    
    expect(wrapper.html()).toContain('Hello World');
  });
});
