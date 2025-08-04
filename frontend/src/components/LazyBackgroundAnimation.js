import React, { Suspense } from 'react';

const BackgroundAnimation = React.lazy(() => import('./BackgroundAnimation'));

const LazyBackgroundAnimation = () => {
  return (
    <Suspense fallback={<div style={{ display: 'none' }}></div>}>
      <BackgroundAnimation />
    </Suspense>
  );
};

export default LazyBackgroundAnimation; 