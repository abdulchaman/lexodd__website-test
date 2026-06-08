import React from 'react';
import { SkeletonHero, SkeletonGrid } from './Skeletons';

export const HomeRouteFallback = () => (
  <div className="home-route-fallback" aria-label="Loading homepage">
    <div className="home-route-fallback__inner">
      <div className="home-route-fallback__mark" aria-hidden="true" />
      <span>Lexodd</span>
    </div>
  </div>
);

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
