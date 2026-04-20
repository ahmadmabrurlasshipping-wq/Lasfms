import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'sm';
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, className, variant = 'default', title, subtitle, action }: CardProps) {
  return (
    <div className={cn(variant === 'sm' ? 'glass-card-sm' : 'glass-card', className)}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-glass-border2">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-text-100 flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-text-400 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'text-neon',
  trend,
  trendUp,
  className,
}: {
  label: string;
  value: string | number;
  icon?: any;
  color?: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-wider uppercase text-text-400">
          {label}
        </span>
        {Icon && <Icon className={cn('w-7 h-7 opacity-20', color)} />}
      </div>
      <div className={cn('text-3xl font-extrabold font-mono mb-1', color)}>
        {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
      </div>
      {trend && (
        <div className={cn('text-xs flex items-center gap-1', trendUp ? 'text-green-400' : 'text-text-400')}>
          {trendUp ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
