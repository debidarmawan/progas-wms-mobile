import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View, type ViewProps } from 'react-native';

const badgeVariants = cva(
  cn(
    'w-auto flex-row items-center justify-center rounded-md border px-2 py-0.5',
    Platform.select({ web: 'focus-visible:ring-ring/50 w-fit shrink-0 overflow-hidden whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px]' })
  ),
  {
    variants: {
      variant: {
        default: cn('border-transparent bg-primary', Platform.select({ web: '[a&]:hover:bg-primary/90' })),
        secondary: cn('border-transparent bg-secondary', Platform.select({ web: '[a&]:hover:bg-secondary/90' })),
        destructive: cn('border-transparent bg-destructive', Platform.select({ web: '[a&]:hover:bg-destructive/90' })),
        outline: cn('border-border bg-background', Platform.select({ web: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground' })),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = ViewProps & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <View className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };

