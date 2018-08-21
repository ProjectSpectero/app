import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import helloWorld from '@/components/helloWorld.vue'

describe('helloWorld.vue', () => {
  it('finds the "partial" word', () => {
    const msg = 'partial'
    const wrapper = shallowMount(helloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
