import { Box, Skeleton } from '@mui/material';
import { SkeletonMakerPropsType } from './SkeletonMaker.type';

const SkeletonMaker = ({ type }: SkeletonMakerPropsType) => {
  return type === 'table' ? (
    <Box>
      <Skeleton height={60} />
      <Skeleton variant="rectangular" height={200} />
      <Skeleton height={60} />
    </Box>
  ) : type === 'generic' ? (
    <Box>
      <Skeleton variant="rectangular" width={'100%'} height={200} />
    </Box>
  ) : (
    <></>
  );
};

export default SkeletonMaker;
