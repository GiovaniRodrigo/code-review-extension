import React from 'react';

export interface Finding {
  id: string;
  file: string;
  line: number;
  message: string;
  severity: 'info' | 'warning' | 'error';
  status: 'pending' | 'approved' | 'rejected';
  suggestedFix?: string;
}

interface FindingCardProps {
  finding: Finding;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, onApprove, onReject }) => {
  const severityColor = {
    info: '#2196f3',
    warning: '#ff9800',
    error: '#f44336'
  }[finding.severity];

  return (
    <div style={{ 
      border: `1px solid ${severityColor}`, 
      borderRadius: '4px', 
      padding: '12px', 
      marginBottom: '10px',
      backgroundColor: '#1e1e1e',
      color: '#cccccc'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', color: severityColor }}>
          {finding.severity.toUpperCase()}
        </span>
        <span>{finding.file}:{finding.line}</span>
      </div>
      <p style={{ margin: '0 0 12px 0' }}>{finding.message}</p>
      
      {finding.status === 'pending' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onApprove(finding.id)}
            style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
          >
            Approve
          </button>
          <button 
            onClick={() => onReject(finding.id)}
            style={{ backgroundColor: '#c62828', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
          >
            Reject
          </button>
        </div>
      )}
      {finding.status !== 'pending' && (
        <span style={{ fontStyle: 'italic', fontSize: '0.9em' }}>
          Status: {finding.status}
        </span>
      )}
    </div>
  );
};
