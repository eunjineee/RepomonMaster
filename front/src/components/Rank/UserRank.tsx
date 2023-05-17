'use client';

import React, { useEffect, useState } from 'react';
import { axiosRequestUserRank } from '@/api/rank';
import { UserRankContentType, UserRankInfoType } from '@/types/rank';
import styles from './UserRank.module.scss';
import Image from 'next/image';
import Pagination from '@/components/UI/Pagination';
import top1Icon from 'public/static/rank/1.png';
import top2Icon from 'public/static/rank/2.png';
import top3Icon from 'public/static/rank/3.png';
import { pretreatModelUrl } from '@/app/utils/PretreatModelUrl';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

const UserRank = ({ searchInput, searchRequestSign }: { searchInput: string; searchRequestSign: boolean }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [top3, setTop3] = useState<UserRankContentType[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [userRankInfo, setUserRankInfo] = useState<UserRankInfoType>();
  const router = useRouter();

  useEffect(() => {
    if (userRankInfo) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [userRankInfo]);

  useEffect(() => {
    requestUserRank();
  }, [page, searchRequestSign]);

  const onClickUserItem = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  const requestUserRank = async () => {
    try {
      const res = await axiosRequestUserRank(page - 1, searchInput);
      console.log('유저 랭킹: ', res);
      setUserRankInfo(res.data);
      if (isInitial) {
        setTop3(res.data.content.slice(0, 3));
        setIsInitial(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          <div className={`${styles['top-3-div']} hidden md:block`}>
            {top3.map((data, index) => (
              <div key={index} className={styles[`top-${index + 1}`]} onClick={() => onClickUserItem(data.userId)}>
                <div className={styles.border} />
                <div className={styles['main-element']} />
                <Image
                  alt={`top${index + 1}icon`}
                  src={index === 0 ? top1Icon : index === 1 ? top2Icon : top3Icon}
                  width={35}
                  height={35}
                  className={styles['rank-icon']}></Image>
                <div className={styles['img-div']}>
                  <Image alt={`top${index + 1}`} src={data.avatarUrl} width={150} height={120}></Image>
                  <p className={styles['repomon-name']}>{data.username}</p>
                </div>
                <div className={styles['info-div']}>
                  <p className={styles['card-title']}>활성 레포지토리</p>
                  <p className={styles['card-content']}>{data.activeRepoCount}</p>
                  <p className={styles['card-title']}>경험치 총합</p>
                  <p className={styles['card-content']}>
                    {data.totalExp.toLocaleString()}
                    <span> EXP</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.list}>
            <div className={styles['list-title']}>
              <span>순위</span>
              <span>유저</span>
              <span>활성 레포지토리</span>
              <span>경험치 총합</span>
            </div>
            {userRankInfo?.content.map((item, index) => (
              <div key={index} className={styles['list-item']} onClick={() => onClickUserItem(item.userId)}>
                <span>{item.userRank}</span>
                <span
                  style={{
                    justifyContent: 'flex-start',
                    transform: 'translateX(30%)',
                  }}>
                  <Image alt='유저' src={item.avatarUrl} width={30} height={30}></Image>
                  <span className={styles['user-name']}>{item.username}</span>
                </span>
                <span>{item.activeRepoCount}</span>
                <span>
                  {item.totalExp.toLocaleString()}
                  <span
                    style={{
                      margin: '0 0 0 0.3rem',
                    }}>
                    EXP
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className={styles['pagination-div']}>
            <Pagination
              size={20}
              currentPage={page}
              setCurrentPage={setPage}
              totalPage={userRankInfo?.totalPages!}
              totalElement={userRankInfo?.totalElements!}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserRank;
