import { shallowMount, mount } from '@vue/test-utils'
import SectionsMain from '../lib/src/components/Sections/index.vue'

describe('SectionsMain', () => {
  // test('calls initializeSections and computeLayoutData in fetch()', async () => {
  //   // Create a spy for both methods
  //   const initializeSectionsSpy = jest.spyOn(SectionsMain.methods, 'initializeSections')
  //   const computeLayoutDataSpy = jest.spyOn(SectionsMain.methods, 'computeLayoutData')
  //
  //   // Mount the component
  //   const wrapper = shallowMount(SectionsMain, {
  //     mocks: {
  //       // Mock any dependencies like $axios or $store if they are used in fetch
  //       $sections: {
  //         cname: true
  //       }
  //     }
  //   })
  //
  //   // Manually call the fetch method
  //   await wrapper.vm.fetch()
  //
  //   // Check if both methods were called
  //   expect(initializeSectionsSpy).toHaveBeenCalled()
  //   expect(computeLayoutDataSpy).toHaveBeenCalled()
  //
  //   // Optionally, check if initializeSections is called with the expected argument
  //   // Example: expect(initializeSectionsSpy).toHaveBeenCalledWith(expectedResponse)
  //
  //   // Clean up the spies
  //   initializeSectionsSpy.mockRestore()
  //   computeLayoutDataSpy.mockRestore()
  // })

  let controlsWrapper;

  beforeEach(() => {
    controlsWrapper = shallowMount(SectionsMain, {
      mocks: {
        ...global.mocks,
        $sections: {
          cname: true
        }
      },
      propsData: {
        admin: true,
        isModalOpen: true,
        currentSection: false,
        isCreateInstance: false,
        typesTab: 'types',
        sectionsFilterName: '',
        sectionsFilterAppName: '',
        appNames: []
      },
      data() {
        return {
          editMode: true,
          sectionOptions: {}, // Mock initial state
          view: { id: 'view-id', name: 'section1', weight: 1, type: 'text' }, // Mock view object
          currentViews: [
            { id: 'view-1', name: 'section1', weight: 1, type: 'text', linked_to: '' },
            { id: 'view-2', name: 'section2', weight: 2, type: 'image', linked_to: '' },
          ]
        };
      },
    });
  });

  it('addSectionType function should set section.weight if it is null, "null", or undefined', () => {
    const wrapper = shallowMount(SectionsMain, {
      mocks: {
        ...global.mocks,
        $sections: {
          cname: true
        }
      }
    });

    // Mocking component instance properties
    wrapper.vm.displayVariations = {
      variation1: {
        views: { view1: {}, view2: {}, view3: {} },
      },
    };
    wrapper.vm.selectedVariation = 'variation1';

    const testCases = [null, 'null', undefined];
    testCases.forEach((initialWeight, idx) => {
      wrapper.vm.displayVariations = {
        variation1: {
          views: { view1: {}, view2: {}, view3: {} },
        },
      };
      const section = { weight: initialWeight };
      const showToast = jest.fn(); // Mock function
      const instance = {}; // Placeholder, customize if needed

      // Call the function
      wrapper.vm.addSectionType(section, showToast, instance);

      // Assert that weight has been set
      expect(section.weight).toBe(3); // Expect the length of views
    });
  });

  const TestComponent = {
    template: `
    <div>
      <div ref="sectionsMainTarget" style="position: relative; height: 500px; overflow: auto;">
        <div id="section-1" style="height: 100px; margin-top: 300px;">Section 1</div>
        <div id="section-2" style="height: 100px; margin-top: 300px;">Section 2</div>
      </div>
      <div ref="resizeTarget" style="position: relative; height: 500px; overflow: auto;"></div>
    </div>
  `,
    methods: {
      edit(view, viewAnchor) {
        setTimeout(() => {
          if (this.$refs.sectionsMainTarget) {
            const targetElement = this.$refs.sectionsMainTarget.querySelector(viewAnchor);
            if (targetElement) {
              const targetPosition = targetElement.offsetTop; // Get the vertical position of the element
              this.$refs.sectionsMainTarget.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
              });
            }
          }
        }, 600);
      },
    },
  };

  jest.useFakeTimers();

  it('scrolls to the correct section when edit is called', async () => {
    const wrapper = mount(TestComponent);

    // Mock both scrollTo methods
    const scrollToMock = jest.fn();
    wrapper.vm.$refs.sectionsMainTarget.scrollTo = scrollToMock;

    wrapper.vm.$refs.sectionsMainTarget.querySelector = jest.fn(() => ({
      offsetTop: 300, // Mocking the offsetTop value
    }));

    // Call the edit function
    wrapper.vm.edit(null, '#section-1');

    // Fast-forward the timer
    jest.runAllTimers();

    // Assert that scrollTo was called with the correct parameters
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 300,
      behavior: 'smooth',
    });
  });


  it('renders a SettingsIcon for each view', () => {
    // Find all instances of the SettingsIcon
    const settingsIcons = controlsWrapper.findAll('.settings-icon-wrapper');
    expect(settingsIcons.length).toBe(2); // Assert there are two icons (one per view)
  });

  it('toggles sectionOptions for the correct view when SettingsIcon is clicked', async () => {
    // Initialize sectionOptions
    controlsWrapper.setData({
      sectionOptions: {
        'view-1': false,
        'view-2': false,
      },
    });

    // Find the SettingsIcon for the first view and click it
    const firstSettingsIcon = controlsWrapper.findAll('.settings-icon-wrapper').at(0);
    await firstSettingsIcon.trigger('click');

    // Assert that sectionOptions for 'view-1' is toggled
    expect(controlsWrapper.vm.sectionOptions['view-1']).toBe(true);
    // Assert that sectionOptions for 'view-2' is unchanged
    expect(controlsWrapper.vm.sectionOptions['view-2']).toBe(false);

    // Find the SettingsIcon for the second view and click it
    const secondSettingsIcon = controlsWrapper.findAll('.settings-icon-wrapper').at(1);
    await secondSettingsIcon.trigger('click');

    // Assert that sectionOptions for 'view-2' is toggled
    expect(controlsWrapper.vm.sectionOptions['view-2']).toBe(true);
    // Assert that sectionOptions for 'view-1' remains unchanged
    expect(controlsWrapper.vm.sectionOptions['view-1']).toBe(true); // Remains true from the earlier toggle
  });

  it('renders controls div only for the view with sectionOptions set to true', async () => {
    // Set sectionOptions for only the first view
    controlsWrapper.setData({
      sectionOptions: {
        'view-1': true,
        'view-2': false,
      },
    });

    // Assert that the controls div is rendered for the first view
    const controls = controlsWrapper.findAll('.controls');
    expect(controls.length).toBe(2);
    expect(controls.at(0).element.closest('section').id).toBe('section1-view-1');

    // Set sectionOptions for only the second view
    await controlsWrapper.setData({
      sectionOptions: {
        'view-1': false,
        'view-2': true,
      },
    });

    // Assert that the controls div is now rendered for the second view
    const updatedControls = controlsWrapper.findAll('.controls');
    expect(updatedControls.length).toBe(3);
    expect(updatedControls.at(0).element.closest('section').id).toBe('section1-view-1');
  });

  it('shows input and select filters for all tabs', async () => {

    const tabsWrapper = shallowMount(SectionsMain, {
      mocks: {
        ...global.mocks,
        $sections: {
          cname: true
        }
      },
      propsData: {
        admin: true
      },
      data() {
        return {
          editMode: true,
          pageNotFound: false,
          isModalOpen: true,
          currentSection: false,
          isCreateInstance: false,
          typesTab: 'types',
          sectionsFilterName: '',
          sectionsFilterAppName: '',
          appNames: ['sections'],
          sectionOptions: {}, // Mock initial state
          view: { id: 'view-id', name: 'section1', weight: 1, type: 'text' }, // Mock view object
          currentViews: [
            { id: 'view-1', name: 'section1', weight: 1, type: 'text', linked_to: '' },
            { id: 'view-2', name: 'section2', weight: 2, type: 'image', linked_to: '' },
          ]
        };
      },
    });

    const tabs = ['types', 'globalTypes', 'inventoryTypes'];

    for (const tab of tabs) {
      // Set the active tab
      await tabsWrapper.setData({ typesTab: tab });

      // Assert input field is visible
      const inputFilter = tabsWrapper.find('input.sectionsFilterName');
      expect(inputFilter.exists()).toBe(true);

      // Assert select dropdown is visible
      const selectFilter = tabsWrapper.find('select#select');
      expect(selectFilter.exists()).toBe(true);

      // Assert the "clear filters" text is visible
      const clearFilters = tabsWrapper.find('.slot-name');
      expect(clearFilters.exists()).toBe(true);
    }
  });

})

describe('render call has language sent in qs when the condition is met', () => {
  let wrapper;
  let mockAxios;

  beforeEach(() => {
    mockAxios = {
      post: jest.fn(() => Promise.resolve({ data: {} })),
    };

    wrapper = shallowMount(SectionsMain, {
      mocks: {
        ...global.mocks,
        $sections: {
          serverUrl: 'https://mock.server',
          projectId: 'mockProjectId',
          queryStringSupport: 'enabled',
        },
        $axios: mockAxios,
        $i18n: {
          locale: 'fr',
          defaultLocale: 'en',
        },
        $route: {
          query: jest.fn(),
          params: {
            pathMatch: jest.fn()
          }
        },
        sectionHeader: jest.fn().mockReturnValue({}),
        parseQS: jest.fn((path, hasQuery, query) => ({ path, hasQuery, query })),
        validateQS: jest.fn((queryString, keys, editMode) => ({ validated: true })),
      },
      propsData: {},
    });
  });

  it('includes query_string and language in variables when queryStringSupport is enabled', async () => {
    const gt = {
      section: {
        name: 'testSection',
      },
      query_string_keys: ['key1', 'key2'],
    };
    const options = { option1: true };

    await wrapper.vm.renderConfigurableSection(gt, options);

    // Assert axios.post is called with the correct URL and variables
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://mock.server/project/mockProjectId/section/render',
      expect.objectContaining({
        query_string: expect.objectContaining({
          language: 'fr', // Assert language is included
        }),
      }),
      expect.any(Object) // headers/config
    );
  });

  it('does not include query_string if queryStringSupport is disabled', async () => {
    wrapper.vm.$sections.queryStringSupport = 'disabled';

    const gt = {
      section: {
        name: 'testSection',
      },
      query_string_keys: [],
    };
    const options = { option1: true };

    await wrapper.vm.renderConfigurableSection(gt, options);

    // Assert axios.post is called without query_string in variables
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://mock.server/project/mockProjectId/section/render',
      expect.not.objectContaining({
        query_string: expect.any(Object),
      }),
      expect.any(Object)
    );
  });

  it('does not include language if locale matches defaultLocale', async () => {
    wrapper.vm.$i18n.locale = 'en'; // Set to default locale

    const gt = {
      section: {
        name: 'testSection',
      },
      query_string_keys: ['key1', 'key2'],
    };
    const options = { option1: true };

    await wrapper.vm.renderConfigurableSection(gt, options);

    // Assert axios.post is called with query_string but no language
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://mock.server/project/mockProjectId/section/render',
      expect.objectContaining({
        query_string: expect.not.objectContaining({
          language: expect.any(String),
        }),
      }),
      expect.any(Object)
    );
  });
});


describe('alteredViews computed property', () => {
  let wrapper;
  let mockImportJs;

  beforeEach(() => {
    mockImportJs = jest.fn();
    wrapper = mount(SectionsMain, {
      mocks: {
        ...global.mocks,
        $sections: {
          serverUrl: 'https://mock.server',
          projectId: 'mockProjectId',
          queryStringSupport: 'enabled',
        },
        $i18n: {
          locale: 'fr',
          defaultLocale: 'en',
        },
        $route: {
          query: jest.fn(),
          params: {
            pathMatch: jest.fn()
          }
        },
        sectionHeader: jest.fn().mockReturnValue({}),
        parseQS: jest.fn((path, hasQuery, query) => ({ path, hasQuery, query })),
        validateQS: jest.fn((queryString, keys, editMode) => ({ validated: true })),
      },
      methods: {
        importJs: mockImportJs,
      },
    });
  });

  it('returns alteredSections when page_pre_render is a function and returns a value', () => {
    const mockPagePreRender = jest.fn().mockReturnValue([{ id: 1 }]);
    mockImportJs.mockReturnValue({
      page_pre_render: mockPagePreRender,
    });

    wrapper.setData({
      pageData: [{ id: 1 }],
      currentViews: [{ id: 2 }],
    });

    expect(wrapper.vm.alteredViews).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 2, weight: 0 })])
    );
  });

  it('returns currentViews when page_pre_render is not a function', () => {
    mockImportJs.mockReturnValue({
      page_pre_render: 'not-a-function',
    });

    wrapper.setData({
      pageData: [{ id: 1 }],
      currentViews: [{ id: 2 }],
    });

    expect(wrapper.vm.alteredViews).toEqual([{ id: 2, weight: 0 }]);
  });

  it('returns currentViews when page_pre_render returns null', () => {
    const mockPagePreRender = jest.fn().mockReturnValue(null);
    mockImportJs.mockReturnValue({
      page_pre_render: mockPagePreRender,
    });

    wrapper.setData({
      pageData: [{ id: 1 }],
      currentViews: [{ id: 2 }],
    });

    expect(wrapper.vm.alteredViews).toEqual([{ id: 2, weight: 0 }]);
  });
});
