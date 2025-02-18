import React, { useEffect } from 'react';
import { useProjectMetrics } from '../contexts/ProjectMetricsContext';
import MetricCard from './MetricCard';

function ProjectMetricsDisplay({ projectId }: { projectId: string }) {
  const { metrics, isLoading, error, calculateMetrics } = useProjectMetrics();

   
  useEffect(() => {
    if (projectId) {
      calculateMetrics(projectId);
    }
  }, [calculateMetrics, projectId]);

  if (isLoading) return <div className="text-center py-8">Loading metrics...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
  if (!metrics) return <div className="text-center py-8">No metrics available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <MetricCard 
        title="Activity" 
        value={metrics.activity.commitFrequency} 
        description="Commits per day"
        trend="up"
      />
      <MetricCard 
        title="Maintenance" 
        value={metrics.maintenance.dependencyHealth} 
        description="Dependency health score"
        trend="neutral"
      />
      <MetricCard 
        title="Stability" 
        value={metrics.stability.bugRate} 
        description="Bug frequency"
        trend="down"
      />
      <MetricCard 
        title="Community" 
        value={metrics.community.communityEngagement} 
        description="Community engagement score"
        trend="up"
      />
    </div>
  );
}

export default ProjectMetricsDisplay;