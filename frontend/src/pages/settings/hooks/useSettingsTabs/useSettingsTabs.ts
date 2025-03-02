import TabCategories from '../../components/tab-categories/TabCategories';
import TabSubcategories from '../../components/tab-subcategories/TabSubcategories';


const useSettingsTabs = () => {
  const tabs = [
    { id: 0, labelLangCode: 'settings.tabs.categories', component: TabCategories },
    { id: 1, labelLangCode: 'settings.tabs.subcategories', component: TabSubcategories },
  ];
  return { tabs };
};

export default useSettingsTabs;
