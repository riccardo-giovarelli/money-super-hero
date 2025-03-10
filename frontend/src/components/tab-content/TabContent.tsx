import { Box } from '@mui/material';

import { TabContentPropsType } from './TabContent.type';

const TabContent = ({ children, value, index }: TabContentPropsType) => {
  return (
    <div role='tabpanel' hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ paddingY: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabContent;
