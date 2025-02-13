
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
export interface MaintenanceMetrics{
    dependencyUpdates: number; //NOTE - Number of dependency updates per week
    codeQuality: number; //NOTE - Code quality score
    testCoverage: number; //NOTE - Test coverage percentage
    codeReviewFrequency: number; //NOTE - Number of code reviews per week
}

//!SECTION - Stability Metrics
export interface StabilityMetrics{
    bugFrequency: number; //NOTE - Number of bugs per week
    releaseFrequency: number; //NOTE - Number of releases per month
    breakingChanges: number; //NOTE - Number of breaking changes per month
    versionStability: number; //NOTE - Version stability score
}

//!SECTION - Community Metrics
export interface CommunityMetrics{
    contributors: number; //NOTE - Number of contributors
    stars: number;//NOTE - Number of starts
    forks: number; //NOTE - Number of forks
    issuesEngagement:number; //NOTE - Number of issues engagement
}


