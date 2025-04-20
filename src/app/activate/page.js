import { Suspense } from 'react';
import ActivatePage from '@/components/TokenUsage';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ActivatePage />
    </Suspense>
  );
}