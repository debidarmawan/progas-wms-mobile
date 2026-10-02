import { cn } from '@/shared/utils/cn';
import * as React from 'react';
import { Platform, TextInput, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & React.RefAttributes<TextInput>;

function Input({ className, placeholderClassName, editable = true, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'border-input bg-background text-foreground flex h-10 w-full flex-row items-center rounded-md border px-3 text-base shadow-sm shadow-black/5 sm:h-9',
        Platform.select({
          web: 'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        }),
        !editable && 'opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      editable={editable}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };

