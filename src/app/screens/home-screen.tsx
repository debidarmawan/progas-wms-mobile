import { BrandMark } from '@/components/organisms/brand-mark';
import { ScreenContainer } from '@/components/templates/screen-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomeScreen() {
  return (
    <ScreenContainer>
      <BrandMark />
      <Card>
        <CardHeader>
          <CardTitle>Progas WMS Mobile</CardTitle>
          <CardDescription>Design system & navigation scaffold siap digunakan.</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Komponen UI (ui/, templates/, organisms/) sudah senada dengan styling dashboard web.
          </CardDescription>
        </CardContent>
      </Card>
    </ScreenContainer>
  );
}
