import { Card, CardContent, Skeleton, Typography } from "@mui/material";

export default function ReportCard({
  value,
  label,
  loading,
}: {
  value: number;
  label: string;
  loading: boolean;
}) {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={120} height={120} />
      ) : (
        <Card sx={{ width: 120, height: 120 }}>
          <CardContent>
            <Typography variant="body1" align="center">
              {label}
            </Typography>
            <Typography variant="h3" align="center" component="div">
              {value}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
