import { Text } from '@/components/ui/text';
import { cn } from '@/shared/utils/cn';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        'bg-card border-border rounded-xl border shadow-sm shadow-black/5',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return <View className={cn('flex-col gap-1.5 p-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text variant="h4" className={cn('leading-none', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text variant="muted" className={className} {...props} />;
}

function CardContent({ className, ...props }: ViewProps) {
  return <View className={cn('p-6 pt-0', className)} {...props} />;
}

function CardFooter({ className, ...props }: ViewProps) {
  return <View className={cn('flex-row items-center p-6 pt-0', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
