import { KeyboardAvoidingView, ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = ViewProps & {
  scrollable?: boolean;
  /** Keeps content above the software keyboard. Enable on screens with text inputs. */
  keyboardAvoiding?: boolean;
};

/** Shared screen chrome: safe-area + background + consistent horizontal padding. */
export function ScreenContainer({
  scrollable = false,
  keyboardAvoiding = false,
  className,
  children,
  ...props
}: ScreenContainerProps) {
  const body = scrollable ? (
    <ScrollView contentContainerClassName="flex-grow gap-4 p-4" keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1 gap-4 p-4">{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" {...props}>
      {/* Android runs edge-to-edge, so windowSoftInputMode=resize no longer lifts the
          window: an explicit behavior is required or the keyboard covers the inputs. */}
      {keyboardAvoiding ? (
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}
