import { cn } from '@/shared/utils/cn';
import * as LabelPrimitive from '@rn-primitives/label';

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  ...props
}: LabelPrimitive.TextProps) {
  return (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <LabelPrimitive.Text
        className={cn(
          'text-foreground text-sm leading-none font-medium select-none',
          className
        )}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
