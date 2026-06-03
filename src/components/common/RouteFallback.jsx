import React from 'react';
import { SkeletonHero, SkeletonGrid } from './Skeletons';

const RouteFallback = () => (
  <div className="container">
    <div className="page">
      <SkeletonHero />
      <div className="sec">
        <SkeletonGrid count={3} />
      </div>
    </div>
  </div>
);

export default RouteFallback;
