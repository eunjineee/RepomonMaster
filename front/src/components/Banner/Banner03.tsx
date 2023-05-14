'use client';
import React from 'react';
import styles from './banner.module.scss';

const Banner03 = () => {
  return (
    <div className={`${styles.container} `}>
      <div className={`${styles.banner} `}>
        <div className='flex w-full  '>
          <div className={`${styles.left}`}>
            <p className={styles.title}>
              레포몬 배틀을 통해 <br /> 랭킹에 도전해 보세요 !
            </p>
            <p className='text-xl py-10'>깃허브 활동을 통해 얻은 경험치로 스탯을 올릴 수 있어요 😎</p>
          </div>
          <div className={`${styles.right}`} style={{ marginLeft: '10%' }}>
            <img src='/static/images/banner_03.png' alt='' style={{ width: '100%', paddingTop: '5%', paddingBottom: '6%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner03;
