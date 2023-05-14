'use client';
import React from 'react';
import styles from './banner.module.scss';

const Banner02 = () => {
  return (
    <div className={`${styles.container} `}>
      <div className={`${styles.banner} `}>
        <div className='flex w-full  '>
          <div className='w-2/4 h-full'>
            <img src='/static/images/banner_02.png' alt='' style={{ height: '100%', paddingTop: '5%', paddingBottom: '6%' }} />
          </div>
          <div className={`${styles.left}`}>
            <p className={styles.title}>
              레포지토리를 분석하고, <br /> README 에 붙일 수 있어요 !
            </p>
            <p className='text-xl py-10'>유저 카드, 협업 레포지토리 카드, 개인 레포지토리 카드 추출이 가능해요 😊</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner02;
