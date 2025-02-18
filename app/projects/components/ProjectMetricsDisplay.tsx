import React, { Suspense } from "react";
import { useProjectMetrics } from "@/app/contexts/ProjectMetricsContext";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowDown, ArrowUp, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

//NOTE - Display project metrics using cards with progress indicators and animations
export default function ProjectMetricsDisplay({ projectId }: { projectId: string }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<LoadingMetrics />}>
        <MetricsContent projectId={projectId} />
      </Suspense>
    </ErrorBoundary>
  );
}

//NOTE - Error fallback component for error boundary
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Alert variant="destructive" role="alert" aria-live="assertive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        {error.message}
        <button
          onClick={resetErrorBoundary}
          className="text-sm underline hover:text-primary"
          aria-label="Try again"
        >
          Try again
        </button>
      </AlertDescription>
    </Alert>
  );
}

//NOTE - Loading state component with skeletons
function LoadingMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="status" aria-label="Loading metrics">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

//NOTE - Main metrics content component
function MetricsContent({ projectId }: { projectId: string }) {
  const { metrics, calculateMetrics, isLoading, error } = useProjectMetrics();

  React.useEffect(() => {
    if (projectId) {
      calculateMetrics(projectId);
    }
  }, [calculateMetrics, projectId]);

  if (error) {
    throw error; // Let error boundary handle it
  }

  if (isLoading || !metrics) {
    return <LoadingMetrics />;
  }

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <ArrowUp className="h-4 w-4 text-green-500" aria-label="Trending up" />;
    if (value < threshold) return <ArrowDown className="h-4 w-4 text-red-500" aria-label="Trending down" />;
    return <Minus className="h-4 w-4 text-gray-500" aria-label="No trend" />;
  };

  return (
    <motion.div 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Project metrics overview"
    >
      {/* Activity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activity</span>
            {getTrendIcon(metrics.activity.commitFrequency, 1)}
          </CardTitle>
          <CardDescription>Project activity metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MetricItem
              label="Commit Frequency"
              value={`${metrics.activity.commitFrequency}/day`}
              progress={metrics.activity.commitFrequency * 10}
              ariaLabel="Commit frequency metric"
            />
            <MetricItem
              label="PR Frequency"
              value={`${metrics.activity.pullRequestFrequency}/day`}
              progress={metrics.activity.pullRequestFrequency * 10}
              ariaLabel="Pull request frequency metric"
            />
            <MetricItem
              label="Issue Resolution"
              value={`${metrics.activity.issueResolution}%`}
              progress={metrics.activity.issueResolution}
              ariaLabel="Issue resolution rate metric"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Stability
            {getTrendIcon(metrics.stability.versionStability, 0.7)}
          </CardTitle>
          <CardDescription>Project stability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MetricItem
              label="Contributors"
              value={metrics.stability.contributorCount.toString()}
              progress={Math.min(metrics.stability.contributorCount * 10, 100)}
              ariaLabel="Contributor count metric"
            />
            <MetricItem
              label="Bug Rate"
              value={`${metrics.stability.bugRate}%`}
              progress={100 - metrics.stability.bugRate}
              inverse
              ariaLabel="Bug rate metric"
            />
            <MetricItem
              label="Version Stability"
              value={`${(metrics.stability.versionStability * 100).toFixed(0)}%`}
              progress={metrics.stability.versionStability * 100}
              ariaLabel="Version stability metric"
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Maintenance
            {getTrendIcon(metrics.maintenance.dependencyHealth, 0.7)}
          </CardTitle>
          <CardDescription>Project maintenance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MetricItem
              label="Breaking Changes"
              value={metrics.maintenance.breakingChanges.toString()}
              progress={100 - (metrics.maintenance.breakingChanges * 10)}
              inverse
              ariaLabel="Breaking changes metric"
            />
            <MetricItem
              label="Security Issues"
              value={metrics.maintenance.securityVulnerabilities.toString()}
              progress={100 - (metrics.maintenance.securityVulnerabilities * 10)}
              inverse
              ariaLabel="Security vulnerabilities metric"
            />
            <MetricItem
              label="Code Smells"
              value={metrics.maintenance.codeSmells.toString()}
              progress={100 - (metrics.maintenance.codeSmells * 5)}
              inverse
              ariaLabel="Code smells metric"
            />
          </div>
        </CardContent>
      </Card>

      {/* Community Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Community
            {getTrendIcon(metrics.community.communityEngagement, 0.5)}
          </CardTitle>
          <CardDescription>Community engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MetricItem
              label="Stars"
              value={metrics.community.stars.toString()}
              progress={Math.min(metrics.community.stars / 100, 100)}
              ariaLabel="Stars metric"
            />
            <MetricItem
              label="Forks"
              value={metrics.community.forks.toString()}
              progress={Math.min(metrics.community.forks / 50, 100)}
              ariaLabel="Forks metric"
            />
            <MetricItem
              label="Contributors"
              value={metrics.community.contributors.toString()}
              progress={Math.min(metrics.community.contributors * 10, 100)}
              ariaLabel="Contributor count metric"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
  progress: number;
  inverse?: boolean;
  ariaLabel?: string;
}

function MetricItem({ label, value, progress, inverse = false, ariaLabel }: MetricItemProps) {
  const progressValue = Math.max(0, Math.min(100, progress));
  const colorClass = inverse 
    ? progressValue > 70 ? "bg-red-500" : progressValue > 30 ? "bg-yellow-500" : "bg-green-500"
    : progressValue > 70 ? "bg-green-500" : progressValue > 30 ? "bg-yellow-500" : "bg-red-500";

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <Progress 
        value={progressValue} 
        className={colorClass} 
        aria-label={`${label} progress`}
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </motion.div>
  );
}

// Add test data mock for testing
export const mockMetrics = {
  activity: {
    commitFrequency: 5.2,
    pullRequestFrequency: 2.1,
    issueResolution: 85
  },
  stability: {
    contributorCount: 12,
    bugRate: 15,
    versionStability: 0.85
  },
  maintenance: {
    breakingChanges: 2,
    securityVulnerabilities: 1,
    codeSmells: 15
  },
  community: {
    stars: 1250,
    forks: 280,
    contributors: 45
  }
};
