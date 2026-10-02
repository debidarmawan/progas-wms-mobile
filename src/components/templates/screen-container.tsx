import { ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = ViewProps & {
  scrollable?: boolean;
};

/** Shared screen chrome: safe-area + background + consistent horizontal padding. */
export function ScreenContainer({ scrollable = false, className, children, ...props }: ScreenContainerProps) {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable ? { contentContainerClassName: 'flex-grow gap-4 p-4' } : { className: 'flex-1 gap-4 p-4' };

  return (
    <SafeAreaView className="flex-1 bg-background" {...props}>
      <Container {...containerProps}>{children}</Container>
    </SafeAreaView>
  );
}
