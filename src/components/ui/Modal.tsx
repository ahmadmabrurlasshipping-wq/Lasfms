import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  const modalContent = (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className={cn('modal animate-slide-up', sizeClasses[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/30 border border-glass-border2 flex items-center justify-center text-text-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Title */}
        {title && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-text-100 flex items-center gap-2">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Modal Actions Footer Component
export function ModalActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-end gap-2 pt-4 mt-6 border-t border-glass-border2', className)}>
      {children}
    </div>
  );
}
