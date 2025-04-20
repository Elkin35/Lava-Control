import { Suspense } from 'react';
import Response from '@/components/Response';

export default function ResponsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Response />
    </Suspense>
  );
}
