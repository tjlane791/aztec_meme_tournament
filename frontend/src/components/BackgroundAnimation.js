import React from 'react';
import geraksatu from '../assets/geraksatu.png';
import gerakdua from '../assets/gerakdua.png';
import geraktiga from '../assets/geraktiga.png';

const BackgroundAnimation = () => {
  return (
    <div className="background-animation">
      <div 
        className="floating-element"
        style={{
          top: '10%',
          left: '-100px',
          width: '270px',
          height: '270px',
          background: `url(${geraksatu}) no-repeat center`,
          backgroundSize: 'contain',
          animationDelay: '0s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      ></div>
      <div 
        className="floating-element"
        style={{
          top: '40%',
          right: '-100px',
          width: '225px',
          height: '225px',
          background: `url(${gerakdua}) no-repeat center`,
          backgroundSize: 'contain',
          animationDelay: '8s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      ></div>
      <div 
        className="floating-element"
        style={{
          top: '70%',
          left: '-100px',
          width: '315px',
          height: '315px',
          background: `url(${geraktiga}) no-repeat center`,
          backgroundSize: 'contain',
          animationDelay: '16s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      ></div>
      <div 
        className="floating-element"
        style={{
          top: '20%',
          left: '-100px',
          width: '195px',
          height: '195px',
          background: `url(${geraksatu}) no-repeat center`,
          backgroundSize: 'contain',
          animationDelay: '5s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      ></div>
      <div 
        className="floating-element"
        style={{
          top: '60%',
          right: '-100px',
          width: '255px',
          height: '255px',
          background: `url(${gerakdua}) no-repeat center`,
          backgroundSize: 'contain',
          animationDelay: '12s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      ></div>
      <div 
        className="floating-element"
        style={{
          top: '80%',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: `url(${geraktiga}) no-repeat center`,
          backgroundSize: 'contain',
          animationDelay: '20s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      ></div>
    </div>
  );
};

export default BackgroundAnimation; 