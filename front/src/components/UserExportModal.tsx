'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { XMarkIcon } from '@heroicons/react/24/solid';
import styles from './UserExportModal.module.scss';
import ReactMarkdown from 'react-markdown';
import { languageColor } from '@/styles/colors';
import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import { axiosGetUserCardLan, axiosGetUserLan, axiosSetUserCardLan, axiosUpdateUserCard } from '@/api/userRepo';
import LoadingSpinner from './Skeletons/LoadingSpinner';
import Link from 'next/link';

const customStyles = {
  content: {
    zIndex: '10000000',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '470px',
  },
};

const UserExportModal = ({ userId }: { userId: string }) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const cardSource = `![RepomonUserCard](https://repomon.kr/card/user?userId=${userId})`;
  const [lans, setLans] = useState<string[]>();
  const [applied, setApplied] = useState<string[]>();
  const [selected, setSelected] = useState<string[]>([]);
  const [first, setFirst] = useState<boolean>(true);
  const [applyLanLoading, setApplyLanLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!first && lans && applied) {
      setUpdateLoading(false);
      setIsOpen(true);
    }
  }, [first, lans, applied]);

  /** ============================== 함수, Event Handler ============================== */
  const onClickExportBtn = async () => {
    if (updateLoading) {
      return;
    }
    updateUserCard(parseInt(userId, 10));
    getUserLan(parseInt(userId, 10));
    getUserCardLan(parseInt(userId, 10));
  };

  const closeModal = () => {
    setIsOpen(false);
    setUpdateLoading(false);
    setSelected([]);
    setFirst(true);
    setApplyLanLoading(false);
  };

  const onClickLan = (lan: string) => {
    if (selected.includes(lan)) {
      const newSelected = selected.filter((item) => item !== lan);

      setSelected(newSelected);
      return;
    }

    if (selected.length == 6) {
      return;
    }

    setSelected([...selected, lan]);
  };

  const onClickApplyBtn = () => {
    setUserCardLan(parseInt(userId, 10));
  };

  const onClickClearBtn = () => {
    setSelected([]);
  };

  const onClickCopy = () => {
    if (!applied || applied.length === 0) {
      alert('언어를 설정해주세요.');
      return;
    }

    const copyUrl = `[![RepomonUserCard](https://repomon.kr/card/user?userId=${userId})](https://repomon.kr)`;

    window.navigator.clipboard.writeText(copyUrl).then(() => {
      alert('✅ 카드 URL이 복사되었습니다.');
    });
  };

  /** ============================== Axios ============================== */
  const updateUserCard = async (userId: number) => {
    if (first) {
      setUpdateLoading(true);
    } else {
      setApplyLanLoading(true);
    }
    try {
      const res = await axiosUpdateUserCard(userId);
      console.log('유저 카드 갱신: ', res);
      if (first) {
        setFirst(false);
      } else {
        setApplyLanLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUserLan = async (userId: number) => {
    try {
      const res = await axiosGetUserLan(userId);
      console.log('유저 전체 언어 조회: ', res);
      setLans(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserCardLan = async (userId: number) => {
    try {
      const res = await axiosGetUserCardLan(userId);
      console.log('유저 카드에 설정된 언어 조회: ', res);
      setApplied(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const setUserCardLan = async (userId: number) => {
    try {
      const res = await axiosSetUserCardLan(userId, selected);
      console.log('유저 카드 언어 설정: ', res);
      if (res.data.resultCode === 'SUCCESS') {
        setSelected([]);
        updateUserCard(userId);
        getUserCardLan(userId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={`${styles.userCardExport} border-2 rounded-lg flex justify-center my-2 py-1 font-bold`} onClick={onClickExportBtn}>
        {!updateLoading && (
          <div className='flex'>
            <p className='pr-2'>Export User Card</p>
            <FolderArrowDownIcon width='1.25rem' />
          </div>
        )}
        {updateLoading && <LoadingSpinner ml={2} mr={2} size={4} />}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel=''>
        <p className={styles.title}>
          유저 카드 추출
          <XMarkIcon onClick={closeModal} />
        </p>
        <p className={styles.comment}>
          <p>유저 카드를 통해 레포몬 서비스에 대한 나의 정보를 한 눈에 확인할 수 있습니다.</p>
          <p>README에 URL을 입력하면, 유저 카드를 생성할 수 있습니다.</p>
        </p>
        <p className={styles.exam}>
          <span>*</span> {'하단의 예시 카드를 누르면 URL이 복사됩니다.'}
        </p>
        <>
          <p className={styles['set-lan-title']}>언어 설정</p>
          <p className={styles['set-lan-com']}>카드에 표시할 언어를 최대 6개까지 선택해주세요.</p>
          <div className={styles['set-lan-div']}>
            {lans &&
              lans.map((lan, index) => (
                <span key={index} onClick={() => onClickLan(lan)} className={selected.includes(lan) ? styles.selected : undefined}>
                  {lan}
                </span>
              ))}
          </div>
          {selected.length >= 1 && (
            <div className={styles['btn-div']}>
              <button className={styles.clear} onClick={onClickClearBtn}>
                취소
              </button>
              <button className={styles.apply} onClick={onClickApplyBtn}>
                적용
              </button>
            </div>
          )}
          <p className={styles['set-lan-title']}>적용 중인 언어</p>
          <div className={styles['lan-div']}>
            {applied &&
              applied.length > 0 &&
              applied.map((lan, index) => (
                <span
                  key={index}
                  style={
                    languageColor[lan].color
                      ? {
                          backgroundColor: languageColor[lan].color as string,
                        }
                      : { backgroundColor: 'gray' }
                  }>
                  {lan}
                </span>
              ))}
            {(!applied || applied.length === 0) && <p>카드를 추출하려면 언어를 설정해주세요.</p>}
          </div>
        </>
        {applyLanLoading && (
          <div className={styles['spinner-div']}>
            <LoadingSpinner ml={3} mr={3} size={5} />
          </div>
        )}
        {!applyLanLoading && (
          <div className={styles['card-div']} onClick={onClickCopy}>
            <ReactMarkdown>{cardSource}</ReactMarkdown>
          </div>
        )}
        <p className={styles.docs}>
          추가적인 정보는 <Link href='/docs/#RepoTeamCard'>Docs</Link>를 참고해주세요.
        </p>
      </Modal>
    </>
  );
};

export default UserExportModal;
