// tests/App.spec.ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';

// biome-ignore lint/correctness/noUnresolvedImports: Vue SFC components export a default component at build time.
import App from '@/App.vue';
// biome-ignore lint/correctness/noUnresolvedImports: Vue SFC components export a default component at build time.
import AssessmentLayout from '@/layouts/AssessmentLayout.vue';
// biome-ignore lint/correctness/noUnresolvedImports: Vue SFC components export a default component at build time.
import BlankLayout from '@/layouts/BlankLayout.vue';
// biome-ignore lint/correctness/noUnresolvedImports: Vue SFC components export a default component at build time.
import DefaultLayout from '@/layouts/DefaultLayout.vue';

// Mock Component for routing
const DummyComponent = { template: '<div>Page</div>' };

// biome-ignore-start lint/style/useNamingConvention: stub keys must match Vue component names (PascalCase) per @vue/test-utils API
const layoutStubs = {
  DefaultLayout: true,
  BlankLayout: true,
  AssessmentLayout: true,
};
// biome-ignore-end lint/style/useNamingConvention: stub keys must match Vue component names

describe('app.vue Layout Switching', () => {
  it('renders DefaultLayout when meta layout is default or missing', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: DummyComponent, meta: { layout: 'default' } }],
    });

    router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: layoutStubs,
      },
    });

    expect(wrapper.findComponent(DefaultLayout).exists()).toBe(true);
    expect(wrapper.findComponent(BlankLayout).exists()).toBe(false);
  });

  it('renders BlankLayout when meta layout is blank', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/login', component: DummyComponent, meta: { layout: 'blank' } }],
    });

    router.push('/login');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: layoutStubs,
      },
    });

    expect(wrapper.findComponent(BlankLayout).exists()).toBe(true);
    expect(wrapper.findComponent(DefaultLayout).exists()).toBe(false);
  });

  it('renders AssessmentLayout when meta layout is assessment', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/assess', component: DummyComponent, meta: { layout: 'assessment' } }],
    });

    router.push('/assess');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: layoutStubs,
      },
    });

    expect(wrapper.findComponent(AssessmentLayout).exists()).toBe(true);
    expect(wrapper.findComponent(DefaultLayout).exists()).toBe(false);
    expect(wrapper.findComponent(BlankLayout).exists()).toBe(false);
  });
});
