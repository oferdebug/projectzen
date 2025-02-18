import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectMetricsProvider, useProjectMetrics } from '../ProjectMetricsContext';

// Mock fetch globally
const mockFetchResponse = {
  ok: true,
  json: () => Promise.resolve({
    stargazers_count: 100,
    forks_count: 50,
    open_issues_count: 10,
    pulls: [1, 2, 3, 4, 5],
    contributors: [1, 2, 3, 4, 5],
    pushed_at: new Date().toISOString(),
    default_branch: { commit_count: 1000 },
    releases_count: 10,
    dependencies_count: 50,
  }),
};

const mockPullsResponse = {
  ok: true,
  json: () => Promise.resolve([
    { state: 'open', created_at: new Date().toISOString() },
    { state: 'closed', created_at: new Date().toISOString() },
  ]),
};

const mockContributorsResponse = {
  ok: true,
  json: () => Promise.resolve([
    { contributions: 100 },
    { contributions: 50 },
  ]),
};

// Test component that uses the context
function TestComponent({ projectId }: { projectId: string }) {
  const { metrics, calculateMetrics, isLoading, error } = useProjectMetrics();

  React.useEffect(() => {
    if (projectId) {
      calculateMetrics(projectId);
    }
  }, [calculateMetrics, projectId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!metrics) return <div>No metrics</div>;

  return (
    <div>
      <div data-testid="activity">Activity: {metrics.activity.commitFrequency}</div>
      <div data-testid="maintenance">Maintenance: {metrics.maintenance.dependencyHealth}</div>
      <div data-testid="stability">Stability: {metrics.stability.bugRate}</div>
      <div data-testid="community">Community: {metrics.community.communityEngagement}</div>
    </div>
  );
}

describe('ProjectMetricsContext Integration', () => {
  const mockProjectId = 'test-project-id';

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset and setup fetch mock to handle different endpoints
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/pulls')) {
        return Promise.resolve(mockPullsResponse);
      }
      if (url.includes('/contributors')) {
        return Promise.resolve(mockContributorsResponse);
      }
      return Promise.resolve(mockFetchResponse);
    });
  });

  it('provides metrics data to nested components', async () => {
    render(
      <ProjectMetricsProvider>
        <TestComponent projectId={mockProjectId} />
      </ProjectMetricsProvider>
    );

    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for metrics to load and check if they are displayed
    await waitFor(() => {
      expect(screen.getByTestId('activity')).toBeInTheDocument();
    });

    expect(screen.getByTestId('maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('stability')).toBeInTheDocument();
    expect(screen.getByTestId('community')).toBeInTheDocument();

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(mockProjectId)
    );
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

    render(
      <ProjectMetricsProvider>
        <TestComponent projectId={mockProjectId} />
      </ProjectMetricsProvider>
    );

    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/API Error/)).toBeInTheDocument();
  });

  it('updates metrics when project ID changes', async () => {
    const { rerender } = render(
      <ProjectMetricsProvider>
        <TestComponent projectId={mockProjectId} />
      </ProjectMetricsProvider>
    );

    // Wait for initial metrics to load
    await waitFor(() => {
      expect(screen.getByTestId('activity')).toBeInTheDocument();
    });

    // Update mock response for new project ID
    const newMockResponse = {
      ...mockFetchResponse,
      json: () => Promise.resolve({
        stargazers_count: 200,
        forks_count: 100,
        open_issues_count: 20,
        pulls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        contributors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        pushed_at: new Date().toISOString(),
        default_branch: { commit_count: 2000 },
        releases_count: 20,
        dependencies_count: 100,
      }),
    };

    global.fetch = vi.fn().mockResolvedValue(newMockResponse);

    // Rerender with new project ID
    rerender(
      <ProjectMetricsProvider>
        <TestComponent projectId="new-project-id" />
      </ProjectMetricsProvider>
    );

    // Wait for new metrics to load
    await waitFor(() => {
      expect(screen.getByTestId('activity')).toBeInTheDocument();
    });

    // Verify fetch was called with new project ID
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('new-project-id')
    );
  });
}); 