'use client';

import { Box, Typography } from '@mui/material';
import { ProgressPoint } from '../../lib/analytics';

export function ProgressChart({ points }: { points: ProgressPoint[] }) {
  if (points.length === 0) {
    return <Typography color="text.secondary">Complete a session to start your progress chart.</Typography>;
  }

  const width = 720;
  const height = 260;
  const padding = 32;
  const values = points.map((point) => point.averageTimeMs);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coordinates = points.map((point, index) => ({
    x: padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2),
    y: padding + ((point.averageTimeMs - min) / range) * (height - padding * 2),
  }));
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <svg
        role="img"
        aria-label="Average session time progress chart"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
      >
        <title>Average session time over completed sessions</title>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#c6d9d8" />
        <polyline fill="none" stroke="#2f7f8f" strokeWidth="4" points={line} />
        {coordinates.map((point, index) => (
          <circle key={points[index].sessionId} cx={point.x} cy={point.y} r="6" fill="#5e9b86">
            <title>{`${new Date(points[index].date).toLocaleDateString()}: ${(points[index].averageTimeMs / 1000).toFixed(2)} seconds`}</title>
          </circle>
        ))}
      </svg>
    </Box>
  );
}
