/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FindingCard, Finding } from '../src/components/FindingCard';
import React from 'react';

describe('FindingCard', () => {
  const mockFinding: Finding = {
    id: '1',
    file: 'test.ts',
    line: 10,
    message: 'Test message',
    severity: 'error',
    status: 'pending'
  };

  const onApprove = vi.fn();
  const onReject = vi.fn();

  it('should render finding details', () => {
    render(<FindingCard finding={mockFinding} onApprove={onApprove} onReject={onReject} />);
    
    expect(screen.getByText('ERROR')).toBeDefined();
    expect(screen.getByText('test.ts:10')).toBeDefined();
    expect(screen.getByText('Test message')).toBeDefined();
  });

  it('should call onApprove when approve button is clicked', () => {
    render(<FindingCard finding={mockFinding} onApprove={onApprove} onReject={onReject} />);
    
    const approveButton = screen.getByText('Approve');
    fireEvent.click(approveButton);
    
    expect(onApprove).toHaveBeenCalledWith('1');
  });

  it('should call onReject when reject button is clicked', () => {
    render(<FindingCard finding={mockFinding} onApprove={onApprove} onReject={onReject} />);
    
    const rejectButton = screen.getByText('Reject');
    fireEvent.click(rejectButton);
    
    expect(onReject).toHaveBeenCalledWith('1');
  });

  it('should show status if not pending', () => {
    const approvedFinding: Finding = { ...mockFinding, status: 'approved' };
    render(<FindingCard finding={approvedFinding} onApprove={onApprove} onReject={onReject} />);
    
    expect(screen.queryByText('Approve')).toBeNull();
    expect(screen.getByText('Status: approved')).toBeDefined();
  });
});
