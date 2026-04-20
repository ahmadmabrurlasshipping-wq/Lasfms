import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'muted';
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ variant = 'info', children, className, dot = true }: BadgeProps) {
  const variantClasses = {
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info',
    muted: 'badge-muted',
  };

  return (
    <span className={cn('badge', variantClasses[variant], !dot && 'before:content-none', className)}>
      {children}
    </span>
  );
}

// Export pre-configured badges for common use cases
export function StatusBadge({ status }: { status: 'onboard' | 'leave' | 'standby' | 'medical' }) {
  const statusConfig = {
    onboard: { variant: 'success' as const, label: 'Di Kapal' },
    leave: { variant: 'info' as const, label: 'Cuti' },
    standby: { variant: 'warning' as const, label: 'Standby' },
    medical: { variant: 'danger' as const, label: 'Cuti Medis' },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function VesselStatusBadge({ status }: { status: 'operational' | 'docking' | 'building' }) {
  const statusConfig = {
    operational: { variant: 'success' as const, label: 'Beroperasi' },
    docking: { variant: 'warning' as const, label: 'Docking' },
    building: { variant: 'info' as const, label: 'Building' },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function ExpiryBadge({ expiryDate }: { expiryDate: string | null | undefined }) {
  if (!expiryDate) return <Badge variant="muted">—</Badge>;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntil = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) {
    return <Badge variant="danger">Kadaluarsa</Badge>;
  } else if (daysUntil < 30) {
    return <Badge variant="danger">{daysUntil} hari lagi</Badge>;
  } else if (daysUntil < 60) {
    return <Badge variant="warning">{daysUntil} hari lagi</Badge>;
  } else {
    return <Badge variant="success">Valid ✓</Badge>;
  }
}
