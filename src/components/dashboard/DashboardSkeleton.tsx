import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/GridLegacy';

export const DashboardSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Skeleton variant="rectangular" height={120} />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={450} />
      </Grid>
    </Grid>
  );
};
