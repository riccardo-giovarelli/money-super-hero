import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AlertSnackbar from '@/components/alert-snackbar/AlertSnackbar';
import TabContent from '@/components/tab-content/TabContent';
import { Box, Tab, Tabs } from '@mui/material';

import useSettingsTabs from './hooks/useSettingsTabs/useSettingsTabs';
import { useSettingsStore } from './stores/SettingsStore';


const Settings = () => {
  const [tabId, setTabId] = useState(0);
  const { tabs } = useSettingsTabs();
  const { t } = useTranslation();
  const setAlertSnackbarMessage = useSettingsStore((state) => state.setAlertSnackbarMessage);
  const alertSnackbarMessage = useSettingsStore((state) => state.alertSnackbarMessage);

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
      <AlertSnackbar
        message={alertSnackbarMessage?.text ? alertSnackbarMessage.text : ''}
        autoHideDuration={5000}
        severity={alertSnackbarMessage?.type}
        open={alertSnackbarMessage !== null}
        onClose={() => setAlertSnackbarMessage(null)}
      />
    </Box>
  );
};

export default Settings;
