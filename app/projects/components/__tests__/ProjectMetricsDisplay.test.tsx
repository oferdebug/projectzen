import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProjectMetrics } from '@/app/contexts/ProjectMetricsContext';
import ProjectMetricsDisplay from '../ProjectMetricsDisplay';
import { mockMetrics } from '../ProjectMetricsDisplay';

// Mock the context hook
vi.mock('@/app/contexts/ProjectMetricsContext');
const mockUseProjectMetrics = useProjectMetrics as unknown as ReturnType<typeof vi.fn>;

describe('ProjectMetricsDisplay', () => {
  const defaultProps = {
    projectId: 'test-project-id'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockUseProjectMetrics.mockReturnValue({
      metrics: null,
      calculateMetrics: vi.fn(),
      isLoading: true,
      error: null
    });

    render(<ProjectMetricsDisplay {...defaultProps} />);
    
    const loadingElement = screen.getByRole('status', { name: /loading metrics/i });
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    const errorMessage = 'Failed to load metrics';
    mockUseProjectMetrics.mockReturnValue({
      metrics: null,
      calculateMetrics: vi.fn(),
      isLoading: false,
      error: new Error(errorMessage)
    });

    render(<ProjectMetricsDisplay {...defaultProps} />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('renders metrics when data is loaded', async () => {
    const calculateMetrics = vi.fn();
    mockUseProjectMetrics.mockReturnValue({
      metrics: mockMetrics,
      calculateMetrics,
      isLoading: false,
      error: null
    });

    render(<ProjectMetricsDisplay {...defaultProps} />);
    
    // Wait for metrics to be displayed
    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    // Check if all metric sections are rendered
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Stability')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();

    // Check specific metrics
    expect(screen.getByText(/commit frequency/i)).toBeInTheDocument();
    expect(screen.getByText(/issue resolution/i)).toBeInTheDocument();
    expect(screen.getByText(/stars/i)).toBeInTheDocument();

    // Verify calculateMetrics was called
    expect(calculateMetrics).toHaveBeenCalledWith(defaultProps.projectId);
  });

  it('renders trend icons correctly', async () => {
    mockUseProjectMetrics.mockReturnValue({
      metrics: mockMetrics,
      calculateMetrics: vi.fn(),
      isLoading: false,
      error: null
    });

    render(<ProjectMetricsDisplay {...defaultProps} />);
    
    await waitFor(() => {
      const trendIcons = screen.getAllByLabelText(/trending/i);
      expect(trendIcons.length).toBeGreaterThan(0);
    });
  });

  it('renders progress bars with correct colors', async () => {
    mockUseProjectMetrics.mockReturnValue({
      metrics: mockMetrics,
      calculateMetrics: vi.fn(),
      isLoading: false,
      error: null
    });

    render(<ProjectMetricsDisplay {...defaultProps} />);
    
    await waitFor(() => {
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });
}); 