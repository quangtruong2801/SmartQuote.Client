import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard = ({title, value, icon, color}: StatCardProps) => {
  return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h5" sx={{ mt: 1 }}>
            {value}
          </Typography>

          <Box sx={{ color, mt: 1 }}>{icon}</Box>
        </CardContent>
      </Card>
  );
};
