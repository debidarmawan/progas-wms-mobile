import { cn } from '@/shared/utils/cn';
import * as React from 'react';
import { Platform, TextInput, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & React.RefAttributes<TextInput>;

function Input({ className, editable = true, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        // `placeholder:` must stay in the shared className: NativeWind rewrites it into the native
        // `placeholderTextColor` prop, so every input needs it on Android/iOS (not just web).
        'border-input bg-background text-foreground placeholder:text-muted-foreground flex h-10 w-full flex-row items-center rounded-md border px-3 text-base shadow-sm shadow-black/5 sm:h-9',
        Platform.select({
          web: 'selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        }),
        !editable && 'opacity-50',
        className
      )}
      editable={editable}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };

