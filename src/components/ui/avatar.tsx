import { cn } from '@/shared/utils/cn';
import * as AvatarPrimitive from '@rn-primitives/avatar';

function Avatar({ className, ...props }: AvatarPrimitive.RootProps) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.ImageProps) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.FallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
