
//ANCHOR - Project Interface
interface Project{
    id: string; //NOTE - Project ID
    name: string; //NOTE - Project Name
    description: string; //NOTE - Project Description
    status: 'active' | 'completed' | 'archived'; //NOTE - Project Status
    createdAt: Date; //NOTE - Project Creation Date
    updatedAt: Date; //NOTE - Project Update Date
}

//!SECTION - Project Metrics
export interface ProjectMetrics{
    activity: ActivityMetrics; //NOTE - Activity Metrics
    maintenance: MaintenanceMetrics; //NOTE - Maintenance Metrics
    stability: StabilityMetrics; //NOTE - Stability Metrics
    community: CommunityMetrics; //NOTE - Community Metrics
}

//ANCHOR - Activity Metrics
export interface ActivityMetrics{
    commitFrequency: number; //NOTE - Number of commits per week
    issueResolution: number; //NOTE - Average time to resolve an issue
    pullRequestFrequency: number; //NOTE - Number of pull requests per week
    codeReviewFrequency: number; //NOTE - Number of code reviews per week
}

//!SECTION - Maintenance Metrics
export interface MaintenanceMetrics {
  dependencyHealth: any;
  codeSmells: ReactNode;
  securityVulnerabilities: ReactNode;
  breakingChanges: number;
  dependencyUpdates: number; //NOTE - Number of dependency updates per week
  codeQuality: number; //NOTE - Code quality score
  testCoverage: number; //NOTE - Test coverage percentage
  codeReviewFrequency: number; //NOTE - Number of code reviews per week
}

//!SECTION - Stability Metrics
export interface StabilityMetrics {
  bugRate: any;
  contributorCount: ReactNode;
  bugFrequency: number; //NOTE - Number of bugs per week
  releaseFrequency: number; //NOTE - Number of releases per month
  breakingChanges: number; //NOTE - Number of breaking changes per month
  versionStability: number; //NOTE - Version stability score
}

//!SECTION - Community Metrics
export interface CommunityMetrics {
  communityEngagement: any;
  contributors: number; //NOTE - Number of contributors
  stars: number; //NOTE - Number of starts
  forks: number; //NOTE - Number of forks
  issuesEngagement: number; //NOTE - Number of issues engagement
}

//!SECTION - Repository Data
export interface RepositoryData {
  //NOTE - Basic Data
  name: string;
  description: string;
  url: string;

  //NOTE - Activity Metrics Data
  commit: {
    total: number;
    lastCommitDate: Date;
  };
  //!SECTION-Pull Request Metrics Data
  pullRequest: {
    open: number;
    closed: number;
    mergeTIme: number; //NOTE - Average time to merge a pull request
  };
  issues: {
    open: number;
    closed: number;
    resolutionTIme: number; //NOTE - Average time to resolve an issue
  };
  //!SECTION-Maintenance Metrics Data
  dependencies: {
    total: number;
    outdated: number;
  };
  tests: {
    coverage: number;
    passing: number;
    failing: number;
  };
  //!SECTION-Documentation Metrics Data
  documentation: {
    hasReadme: boolean;
    hasDocs: boolean;
    quality: number; //NOTE - 0-100
  };

  //!SECTION - Community Metrics Data
  community: {
    starts: number;
    forks: number;
    watchers: number;
    contributors: number;
  };
}

