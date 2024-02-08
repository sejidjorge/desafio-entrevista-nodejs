"use client";

import { ReportCard } from "@/components/cards";
import { useControlPageTitle } from "@/contexts/PageContext";
import { usePrivateApi } from "@/hooks/apiPrivateHooks";
import { Refresh } from "@mui/icons-material";
import { Button, Grid, IconButton, Tooltip } from "@mui/material";
import { useLayoutEffect, useState } from "react";

export default function Dashboard() {
  const { reports } = usePrivateApi();
  const { setPageTitle } = useControlPageTitle();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    total_bids: number;
    total_cars: number;
    total_purchases: number;
    total_users: number;
  }>({ total_bids: 0, total_cars: 0, total_purchases: 0, total_users: 0 });

  async function getReports() {
    setLoading(true);
    try {
      const { data } = await reports();
      setReport(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    getReports();
    setPageTitle("Dashboard");
  }, []);

  return (
    <div>
      <Grid
        container
        padding={2}
        direction="row"
        justifyContent="end"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            onClick={getReports}
            endIcon={<Refresh />}
          >
            Recarregar
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item>
          <ReportCard
            label="Usuarios"
            value={report?.total_users}
            loading={loading}
          />
        </Grid>
        <Grid item>
          <ReportCard
            label="Carros"
            value={report?.total_cars}
            loading={loading}
          />
        </Grid>
        <Grid item>
          <ReportCard
            label="Lances"
            value={report?.total_bids}
            loading={loading}
          />
        </Grid>
        <Grid item>
          <ReportCard
            label="Compras"
            value={report?.total_purchases}
            loading={loading}
          />
        </Grid>
      </Grid>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
    </div>
  );
}
