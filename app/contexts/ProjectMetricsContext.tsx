import React, { createContext, useContext, useState } from "react";
import { ProjectMetrics } from "@/types/project";

interface ProjectMetricsContextType {
  metrics: ProjectMetrics | null;
  calculateMetrics: (projectId: string) => Promise<void>;
  refreshMetrics: (data: Partial<ProjectMetrics>) => void;
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

  //NOTE - Calculate Metrics
  const calculateMetrics = async (projectId: string): Promise<void> => {
    try {
      //!SECTION - Fetch repository data from GitHub
      const repoData = await fetchRepositoryData(projectId);

      //!SECTION - Calculate Each activity metrics
      const activityMetrics = calculateActivityMetrics(repoData);

      //!SECTION - Calculate maintenance metrics
      const maintenanceMetrics = calculateMaintenanceMetrics(repoData);

      //!SECTION - Calculate stability metrics
      const stabilityMetrics = calculateStabilityMetrics(repoData);

      //!SECTION - Calculate community metrics
      const communityMetrics = calculateCommunityMetrics(repoData);

      //!SECTION - Combine all metrics And Update State
      setMetrics({
        activity: activityMetrics,
        maintenance: maintenanceMetrics,
        stability: stabilityMetrics,
        community: communityMetrics,
      });
    } catch (error) {
      console.error("Failed to calculate metrics:", error);
      throw error;
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
      }}
    >
      {children}
    </ProjectMetricsContext.Provider>
  );
}

//NOTE - useProjectMetrics Hook
export function useProjectMetrics(projectId: string) {
  const context = useContext(ProjectMetricsContext);
  if (!context) {
    throw new Error(
      "UseProjectMetrics Must Be Used Within A ProjectMetricsProvider"
    );
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
  [x: string]: unknown;
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
}

interface StabilityMetrics {
  bugRate: number;
  crashRate: number;
  bugFrequency: number;
  releaseFrequency: number;
  breakingChanges: number;
  versionStability: number;
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
    1, // Ensure at least 1 day to avoid division by zero
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

// Helper functions for more accurate calculations
function calculateIssueResponseTime(repoData: RepositoryData): number {
  // TODO: Implement based on issue timestamps
  return 0;
}

function calculateIssueResolutionRate(repoData: RepositoryData): number {
  // TODO: Implement based on closed issues
  return 0;
}

function calculateCodeReviewFrequency(repoData: RepositoryData): number {
  // TODO: Implement based on PR reviews
  return 0;
}

function calculateStabilityMetrics(repoData: RepositoryData): StabilityMetrics {
  // Calculate bug rate as ratio of issues to commits
  const bugRate =
    repoData.issues > 0 ? Math.floor(repoData.issues / repoData.commits) : 0;

  // Calculate crash rate based on critical issues
  const crashRate =
    repoData.pullRequests > 0
      ? Math.floor(repoData.pullRequests / repoData.commits)
      : 0;

  // Calculate bug frequency per release
  const bugFrequency = repoData.issues > 0 ? repoData.issues : 0;

  // Calculate release frequency
  const releaseFrequency = repoData.releases;

  // Estimate breaking changes based on major version releases
  const breakingChanges = Math.floor(repoData.releases * 0.3);

  // Calculate version stability score
  const versionStability = Math.max(
    1 - breakingChanges / (repoData.releases || 1),
    0
  );

  return {
    bugRate: parseFloat(bugRate.toFixed(2)),
    crashRate: parseFloat(crashRate.toFixed(2)),
    bugFrequency: parseFloat(bugFrequency.toFixed(2)),
    releaseFrequency: parseFloat(releaseFrequency.toFixed(2)),
    breakingChanges: parseFloat(breakingChanges.toFixed(2)),
    versionStability: parseFloat(versionStability.toFixed(2)),
  };
}

function calculateMaintenanceMetrics(
  repoData: RepositoryData
): MaintenanceMetrics {
  const dependencyHealthScore =
    repoData.dependencies > 0 ? 1 - repoData.dependencies / 100 : 1;
  const updateFrequencyScore =
    repoData.releases > 0 ? repoData.releases / 10 : 0;
  return {
    dependencyHealth: parseFloat(dependencyHealthScore.toFixed(2)),
    updateFrequency: parseFloat(updateFrequencyScore.toFixed(2)),
    dependencyUpdates: repoData.dependencies,
    codeQuality: 0, // Implement calculation
    testCoverage: 0, // Implement calculation
    codeReviewFrequency: 0, // Implement calculation
  };
}

function calculateCommunityMetrics(repoData: RepositoryData): CommunityMetrics {
  // Calculate contributor count
  const contributorCount = repoData.contributors;

  // Calculate community engagement score based on stars and forks
  const communityEngagement =
    repoData.stars > 0 || repoData.forks > 0
      ? parseFloat(((repoData.stars + repoData.forks) / 100).toFixed(2))
      : 0;

  // Calculate issues engagement (ratio of issues to contributors)
  const issuesEngagement =
    repoData.contributors > 0
      ? parseFloat((repoData.issues / repoData.contributors).toFixed(2))
      : 0;

  return {
    contributorCount: parseFloat(contributorCount.toFixed(2)),
    communityEngagement,
    contributors: repoData.contributors,
    stars: repoData.stars,
    forks: repoData.forks,
    issuesEngagement,
  };
}
