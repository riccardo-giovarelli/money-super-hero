import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TabContent from '@/components/tab-content/TabContent';
import { Box, Tab, Tabs } from '@mui/material';

import useSettingsTabs from './hooks/useSettingsTabs/useSettingsTabs';


const Settings = () => {
  const [tabId, setTabId] = useState(0);
  const { tabs } = useSettingsTabs();
  const { t } = useTranslation();

  return (
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabId}
          onChange={(_e: React.SyntheticEvent, newValue: number) => {
            setTabId(newValue);
          }}
          variant='scrollable'
          scrollButtons='auto'
          aria-label='settings tabs'
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} value={tab.id} label={t(tab.labelLangCode)} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ marginTop: 1 }}>
        {tabs.map((tab) => (
          <TabContent key={tab.id} index={tab.id} value={tabId}>
            <tab.component />
          </TabContent>
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
