import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// React Router Link 타입에서 href 제외하고 커스텀 href 추가
export interface LinkProps extends Omit<React.ComponentPropsWithoutRef<typeof RouterLink>, 'to'> {
  href?: string;
  to?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, to, children, ...props }, ref) => {
    return (
      <RouterLink
        ref={ref}
        to={to ?? href ?? '#'} // href가 넘어오면 to로 변환
        {...props}
      >
        {children}
      </RouterLink>
    );
  },
);
Link.displayName = 'Link';
