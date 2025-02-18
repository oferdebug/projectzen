import React, { createContext, useContext, useState } from "react";
import { ProjectMetrics } from "@/types/project";

interface ProjectMetricsContextType {
  metrics: ProjectMetrics | null;
  calculateMetrics: (projectId: string) => Promise<void>;
  refreshMetrics: (data: Partial<ProjectMetrics>) => void;
  isLoading: boolean;
  error: Error | null;
}

const ProjectMetricsContext = createContext<
  ProjectMetricsContextType | undefined
>(undefined);

export function ProjectMetricsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  //NOTE - Calculate Metrics
  const calculateMetrics = async (projectId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const repoData = await fetchRepositoryData(projectId);
      const activityMetrics = calculateActivityMetrics(repoData);
      const maintenanceMetrics = calculateMaintenanceMetrics(repoData);
      const stabilityMetrics = calculateStabilityMetrics(repoData);
      const communityMetrics = calculateCommunityMetrics(repoData);

      setMetrics({
        activity: activityMetrics,
        maintenance: maintenanceMetrics,
        stability: stabilityMetrics,
        community: communityMetrics,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error("Failed to calculate metrics:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  //NOTE - Update Metrics With Partial Data
  const refreshMetrics = (data: Partial<ProjectMetrics>) => {
    setMetrics((currentMetrics) =>
      currentMetrics ? { ...currentMetrics, ...data } : null
    );
  };

  return (
    <ProjectMetricsContext.Provider
      value={{
        metrics,
        calculateMetrics,
        refreshMetrics,
        isLoading,
        error,
      }}
    >
      {children}
    </ProjectMetricsContext.Provider>
  );
}

//NOTE - useProjectMetrics Hook
export function useProjectMetrics() {
  const context = useContext(ProjectMetricsContext);
  if (!context) {
    throw new Error("UseProjectMetrics Must Be Used Within A ProjectMetricsProvider");
  }
  return context;
}

// SECTION: Explicit return types
async function fetchRepositoryData(projectId: string): Promise<RepositoryData> {
  // Implementation using fetch API with proper error handling
  try {
    const response = await fetch(`https://api.github.com/repos/${projectId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Get additional data for complete metrics
    const [pullRequests, contributors] = await Promise.all([
      fetch(`https://api.github.com/repos/${projectId}/pulls?state=all`),
      fetch(`https://api.github.com/repos/${projectId}/contributors`),
    ]);

    const pullsData = await pullRequests.json();
    const contributorsData = await contributors.json();

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      pullRequests: pullsData.length,
      contributors: contributorsData.length,
      lastCommit: new Date(data.pushed_at),
      commits: data.default_branch.commit_count || 0,
      releases: data.releases_count || 0,
      dependencies: data.dependencies_count || 0,
    };
  } catch (error) {
    console.error("Failed to fetch repository data:", error);
    throw error;
  }
}

// SECTION: TypeScript strict types
interface RepositoryData {
  stars: number;
  forks: number;
  issues: number;
  pullRequests: number;
  contributors: number;
  lastCommit: Date;
  commits: number;
  releases: number;
  dependencies: number;
}

interface ActivityMetrics {
  commitFrequency: number;
  issueResponseTime: number;
  issueResolution: number;
  pullRequestFrequency: number;
  codeReviewFrequency: number;
}

interface MaintenanceMetrics {
  dependencyHealth: number;
  updateFrequency: number;
  dependencyUpdates: number;
  codeQuality: number;
  testCoverage: number;
  codeReviewFrequency: number;
  codeSmells: number;
  securityVulnerabilities: number;
  breakingChanges: number;
}

interface StabilityMetrics {
  bugRate: number;
  crashRate: number;
  bugFrequency: number;
  releaseFrequency: number;
  breakingChanges: number;
  versionStability: number;
  contributorCount: number;
}

interface CommunityMetrics {
  contributorCount: number;
  communityEngagement: number;
  contributors: number;
  stars: number;
  forks: number;
  issuesEngagement: number;
}

//!SECTION-Add The Metrics Calculation Functions Here

function calculateActivityMetrics(repoData: RepositoryData): ActivityMetrics {
  const daysSinceLastCommit = Math.max(
    1,
    Math.floor((new Date().getTime() - repoData.lastCommit.getTime()) / (1000 * 60 * 60 * 24))
  );

  const commitFrequency = repoData.commits / daysSinceLastCommit;
  const pullRequestFrequency = repoData.pullRequests / daysSinceLastCommit;

  return {
    commitFrequency: parseFloat(commitFrequency.toFixed(2)),
    issueResponseTime: calculateIssueResponseTime(repoData),
    issueResolution: calculateIssueResolutionRate(repoData),
    pullRequestFrequency: parseFloat(pullRequestFrequency.toFixed(2)),
    codeReviewFrequency: calculateCodeReviewFrequency(repoData)
  };
}

function calculateIssueResponseTime(repoData: RepositoryData): number {
  return parseFloat((repoData.issues / (repoData.contributors || 1)).toFixed(2));
}

function calculateIssueResolutionRate(repoData: RepositoryData): number {
  return parseFloat((repoData.issues / (repoData.commits || 1)).toFixed(2));
}

function calculateCodeReviewFrequency(repoData: RepositoryData): number {
  return parseFloat((repoData.pullRequests / (repoData.contributors || 1)).toFixed(2));
}

function calculateMaintenanceMetrics(repoData: RepositoryData): MaintenanceMetrics {
  const dependencyHealthScore = repoData.dependencies > 0 ? 1 - repoData.dependencies / 100 : 1;
  const updateFrequencyScore = repoData.releases > 0 ? repoData.releases / 10 : 0;
    
  return {
    dependencyHealth: parseFloat(dependencyHealthScore.toFixed(2)),
    updateFrequency: parseFloat(updateFrequencyScore.toFixed(2)),
    dependencyUpdates: repoData.dependencies,
    codeQuality: 0,
    testCoverage: 0,
    codeReviewFrequency: 0,
    codeSmells: 0,
    securityVulnerabilities: 0,
    breakingChanges: 0
  };
}

function calculateStabilityMetrics(repoData: RepositoryData): StabilityMetrics {
  const bugRate = repoData.issues > 0 ? Math.floor(repoData.issues / (repoData.commits || 1)) : 0;
  const crashRate = repoData.pullRequests > 0 ? Math.floor(repoData.pullRequests / (repoData.commits || 1)) : 0;
  const bugFrequency = repoData.issues > 0 ? repoData.issues : 0;
  const releaseFrequency = repoData.releases || 0;
  const breakingChanges = Math.floor((repoData.releases || 0) * 0.3);
  const versionStability = Math.max(1 - breakingChanges / (repoData.releases || 1), 0);

  return {
    bugRate: parseFloat(bugRate.toFixed(2)),
    crashRate: parseFloat(crashRate.toFixed(2)),
    bugFrequency: parseFloat(bugFrequency.toFixed(2)),
    releaseFrequency: parseFloat(releaseFrequency.toFixed(2)),
    breakingChanges: parseFloat(breakingChanges.toFixed(2)),
    versionStability: parseFloat(versionStability.toFixed(2)),
    contributorCount: repoData.contributors
  };
}

function calculateCommunityMetrics(repoData: RepositoryData): CommunityMetrics {
  // Calculate contributor count
  const contributorCount = repoData.contributors || 0;

  // Calculate community engagement score based on stars and forks
  const communityEngagement = parseFloat(
    ((repoData.stars + repoData.forks) / 100).toFixed(2)
  );

  // Calculate issues engagement (ratio of issues to contributors)
  const issuesEngagement = parseFloat(
    (repoData.issues / (repoData.contributors || 1)).toFixed(2)
  );

  return {
    contributorCount: parseFloat(contributorCount.toFixed(2)),
    communityEngagement,
    contributors: repoData.contributors || 0,
    stars: repoData.stars || 0,
    forks: repoData.forks || 0,
    issuesEngagement,
  };
}
