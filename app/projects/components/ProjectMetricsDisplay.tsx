import React from "react";
import { useProjectMetrics } from "@/app/contexts/ProjectMetricsContext";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

export function ProjectMetricsDisplay() {
  const { metrics, calculateMetrics } = useProjectMetrics();

  React.useEffect(() => {
    calculateMetrics(projectId);
  }, [projectId, calculateMetrics]);

  if (!metrics) return <div>Loading Metrics...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/*Activity Metrics*/}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Project activity metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Commit Frequency</span>
              <span>{metrics.activity.commitFrequency}/day</span>
            </div>
            <Progress value={metrics.activity.commitFrequency * 10} />
            {/*Add More Activity Metrics */}
          </div>
        </CardContent>
      </Card>
      {/*Stability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Stability</CardTitle>
          <CardDescription>Project stability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Contraibutors</span>
              <span>{metrics.stability.contributorCount}</span>
            </div>
            <Progress value={metrics.stability.contributorCount * 10} />
            {/*Add More Stability Metrics */}
          </div>
        </CardContent>
      </Card>
      {/*Maintenance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenace</CardTitle>
          <CardDescription>Project maintenace metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Breakin Changes</span>
              <span>{metrics.maintenance.breakingChanges}</span>
            </div>
            <Progress value={metrics.maintenance.breakingChanges * 10} />
            {/*Add More Maintenance Metrics */}
            <div className="flex justify-between">
              <span>Security Vulnerabilities</span>
              <span>{metrics.maintenance.securityVulnerabilities}</span>
            </div>
            <Progress
              value={metrics.maintenance.securityVulnerabilities * 10}
            />
            <div className="flex justify-between">
              <span>Code Smells</span>
              <span>{metrics.maintenance.codeSmells}</span>
            </div>
            <Progress value={metrics.maintenance.codeSmells * 10} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
