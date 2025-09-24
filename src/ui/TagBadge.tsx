// TagBadge.tsx
import React from 'react';

interface TagBadgeProps {
  bgColor?: string; // 배경색 클래스
  textColor?: string; // 텍스트 색상 클래스
  children: React.ReactNode; // 태그 안에 표시할 텍스트
}

export default function TagBadge({
  bgColor = 'bg-gray-100',
  textColor = 'text-gray-700',
  children,
}: TagBadgeProps) {
  return (
    <span
      className={`h-7 px-3 inline-flex items-center justify-center rounded-2xl text-xs font-medium ${bgColor} ${textColor}`}
    >
      {children}
    </span>
  );
}
