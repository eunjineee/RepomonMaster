'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

function Page() {
  const [isCardNavOpened, setIsCardNavOpened] = useState<boolean>(true);
  const [isRepomonNavOpened, setIsRepomonNavOpened] = useState<boolean>(true);
  const [isNoteNavOpened, setIsNoteNavOpened] = useState<boolean>(true);
  const [isRepositoryNavOpened, setIsRepositoryNavOpened] = useState<boolean>(true);

  function cardNavToggle() {
    setIsCardNavOpened(!isCardNavOpened);
  }
  function repomonNavToggle() {
    setIsRepomonNavOpened(!isRepomonNavOpened);
  }
  function noteNavToggle() {
    setIsNoteNavOpened(!isNoteNavOpened);
  }
  function repositoryNavToggle() {
    setIsRepositoryNavOpened(!isRepositoryNavOpened);
  }

  return (
    <div className={`${styles.docsDiv} flex `}>
      {/* 네브바 */}
      <div className={`${styles.navDiv} `}>
        {/* 노트 */}
        <div>
          <div className={`${styles.navBarListItem} flex`} onClick={noteNavToggle}>
            {isNoteNavOpened ? <ChevronDownIcon width="1rem" /> : <ChevronRightIcon width="1rem" />}
            <div className={`ps-2`}>
              <a className="text-lg font-bold">Note</a>
            </div>
          </div>
          {isNoteNavOpened ? (
            <>
              {/* <a href='#Patch'>
                <div className={`${styles.navBarItem} flex`}>
                  <div className='border-r-2' style={{ paddingLeft: '17px' }}></div>
                  <p>패치노트</p>
                </div>
              </a> */}

              <a href="#Exp">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>경험치 시스템</p>
                </div>
              </a>
              <a href="#Score">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>레이팅 시스템</p>
                </div>
              </a>
              <a href="#Tier">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>등급 시스템</p>
                </div>
              </a>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 레포지터리 */}
        <div>
          <div className={`${styles.navBarListItem} flex`} onClick={repositoryNavToggle}>
            {isRepositoryNavOpened ? <ChevronDownIcon width="1rem" /> : <ChevronRightIcon width="1rem" />}
            <div className={`ps-2`}>
              <a className="text-lg font-bold">Repository</a>
            </div>
          </div>
          {isRepositoryNavOpened ? (
            <>
              <a href="#RepositoryRenew">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Repository 갱신</p>
                </div>
              </a>
              <a href="#RepositoryActive">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Repository 활성화 / 비활성화</p>
                </div>
              </a>
              <a href="#RepositoryCreateRepomon">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Repository 레포몬 생성</p>
                </div>
              </a>
              <a href="#RepositoryAnalysis">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Repository 분석</p>
                </div>
              </a>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 카드 */}
        <div>
          <a className="text-lg font-bold">
            <div className={`${styles.navBarListItem} flex`} onClick={cardNavToggle}>
              {isCardNavOpened ? <ChevronDownIcon width="1rem" /> : <ChevronRightIcon width="1rem" />}
              <p className={`ps-2`}>Card</p>
            </div>
          </a>
          {isCardNavOpened ? (
            <>
              <a href="#UserCard">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>User Card</p>
                </div>
              </a>
              <a href="#RepoTeamCard">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Repo Team Card</p>
                </div>
              </a>
              <a href="#RepoRersonalCard">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Repo Personal Card</p>
                </div>
              </a>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 레포몬 */}
        <div>
          <div className={`${styles.navBarListItem} flex`} onClick={repomonNavToggle}>
            {isRepomonNavOpened ? <ChevronDownIcon width="1rem" /> : <ChevronRightIcon width="1rem" />}
            <div className={`ps-2`}>
              <a className="text-lg font-bold">Repomon</a>
            </div>
          </div>
          {isRepomonNavOpened ? (
            <>
              <a href="#Status">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Status</p>
                </div>
              </a>
              <a href="#Battle">
                <div className={`${styles.navBarItem} flex`}>
                  <div className="border-r-2" style={{ paddingLeft: '17px' }}></div>
                  <p>Battle</p>
                </div>
              </a>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* 바디 */}
      <div className={`${styles.descriptionDiv} border-l pt-10  grow`}>
        {/* 노트 */}
        <div id="Note" className={`${styles.menu} border-b pb-5`}>
          <p className="text-4xl  pb-5" style={{ color: `rgba(109, 130, 250, 1)`, fontWeight: '1000' }}>
            Note
          </p>
          {/* <div id='Patch' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold pb-3'>패치노트</p>
            <div>
              <p>내용1</p>
              <p>내용2</p>
              <p>내용3</p>
              <p>내용4</p>
              <p>내용5</p>
              <p>내용6</p>
            </div>
          </div> */}
          <div id="Exp" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold pb-3">경험치 시스템</p>
            <li>각 요소는 최근 1년 간 기록을 기준으로 반영됩니다.</li>
            <li>1 Commit = 10 EXP</li>
            <li>1 Merge = 50 EXP</li>
            <li>1 Issue = 20 EXP</li>
            <li>1 Review = 20 EXP</li>
            <li>1 Star = 200 EXP</li>
            <li>1 Fork = 200 EXP</li>
            <li>Star 및 Fork는 최대 5,000개까지 반영됩니다.</li>
          </div>

          <div id="Score" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold pb-3">레이팅 시스템</p>
            <li>
              점수 계산 방식은 체스에서 사용하는 대표적인 레이팅 계산방법인 <strong>Elo Rating System</strong>을 바탕으로 합니다.
            </li>
            <li>
              Elo 계산법의 경우 <strong>수식이 간단하고 직관적</strong>이며, <strong>1:1 경기에 최적화</strong>된 방법으로 레포몬에 맞게 수정하여 사용하고 있습니다.
            </li>
            <li>
              스탯 차이를 반영하기 위해서 <strong>현재의 레이팅</strong>과 <strong>상대와의 스테이터스 차이</strong>를 고려하여 획득할 수 있는 점수가 정해집니다.
            </li>
            <li>
              현재의 레이팅을 기준으로 ±<strong>100</strong> 사이에 있는 유저를 우선적으로 매칭합니다.
            </li>
            <li>한 경기에 획득할 수 있는 최대 레이팅은 50점입니다. (2023.05.10 기준)</li>
          </div>
          <div id="Tier" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">등급 시스템</p>
            <li>
              레포몬에서는 레이팅과 별개의 등급 포인트를 두고 있지 않고, <strong>현재 레이팅 별</strong>로 티어를 제공합니다.
            </li>
            <li>
              티어는 <strong>브론즈, 실버, 골드, 플래티넘, 다이아</strong> 총 다섯 가지 단계로 구분됩니다.
            </li>
            <li>
              레이팅 기준 <strong>1,000점</strong> 미만은 브론즈, <strong>1,000점부터 1,999점</strong>은 실버, <strong>1,200점부터 1,399점</strong>은 골드, <strong>1,400점부터 1,599점</strong>은
              플래티넘, <strong>1,600점 이상</strong>은 다이아 로 구분됩니다. (2023.05.10 기준)
            </li>
            <li>
              현재 티어에 따라 닉네임 옆에 <strong>특정 마크</strong>가 부착됩니다.
            </li>
          </div>
        </div>

        {/* 레포지터리 */}
        <div id="Repository" className={`${styles.menu} border-b pt-8 pb-5`}>
          <p className="text-4xl  pb-5 pb-5 " style={{ color: `rgba(109, 130, 250, 1)`, fontWeight: '1000' }}>
            Repository
          </p>
          <div id="RepositoryRenew" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold pb-3 pb-3">Repository 갱신</p>
            <div>
              <li>
                깃허브의 <strong>repository</strong> 와 <strong>organization</strong> 을 가져올 수 있습니다.
              </li>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                레포지토리 목록 우측의 <strong>갱신 아이콘</strong>을 클릭합니다.{' '}
              </li>
              <div>
                <img className="ms-5 border-4" src="/static/images/docs_repo_reload.png" alt="x" style={{ height: '200px' }}></img>
              </div>
            </div>
          </div>
          <div id="RepositoryActive" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">Repository 활성화 / 비활성화</p>
            <div>
              <li>
                repository 를 repomon 사이트에서 <strong>공개/비공개 여부</strong>를 설정할 수 있습니다.
              </li>
              <li>
                랭킹에 계산되는 점수들은 <strong>공개 상태</strong>인 repository 를 기준으로 합산됩니다.
              </li>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                repository 카드 우측 상단의 <strong>토글 버튼</strong>을 클릭하여 상태를 바꿀 수 있습니다.
              </li>
              <div>
                <img className="ms-5 border-4" src="/static/images/docs_repo_active.png" alt="x" style={{ height: '200px' }}></img>
              </div>
            </div>
          </div>
          <div id="RepositoryCreateRepomon" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">Repository 레포몬 생성</p>
            <div>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                <strong>레포몬 생성 버튼</strong>을 클릭합니다.
              </li>
              <div>
                <img className="ms-5 border-4" src="/static/images/docs_repomon_create_01.png" alt="x" style={{ height: '200px' }}></img>
              </div>
              <li>
                랜덤으로 제공되는 레포몬 3마리중 마음에 드는 <strong>레포몬을 선택</strong>합니다.{' '}
              </li>
              <li>
                레포몬의 <strong>닉네임을 설정</strong>합니다. <strong>(중복 불가)</strong>
              </li>
              <li>
                주사위를 굴려 <strong>초기 스텟</strong>을 정할 수 있습니다.
              </li>
              <li>
                <strong>결정하기 버튼</strong>을 클릭하면 레포몬이 생성됩니다.
              </li>
            </div>
          </div>
          <div id="RepositoryAnalysis" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">Repository 분석</p>
            <div>
              <li>레포지토리 분석의 요소로는 성장 히스토리, 배틀 히스토리, 컨벤션 등록과 컨벤션 지킴율 확인, 기여도 확인 등등이 가능합니다.</li>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                repository 카드의 <strong>이름을 클릭</strong>합니다.{' '}
              </li>
              <li>
                <strong>성장, 배틀, 컨벤션, 기여도 탭</strong>을 이용해 repository 를 살펴봅니다.
              </li>
            </div>
          </div>
        </div>

        {/* 카드 */}
        <div id="Card" className={`${styles.menu} border-b pt-8 pb-5`}>
          <p className="text-4xl  pb-5 pb-5" style={{ color: `rgba(109, 130, 250, 1)`, fontWeight: '1000' }}>
            Card
          </p>
          <div id="UserCard" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold pb-3 pb-3">User Card</p>
            <div>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                내 프로필 페이지에서 <strong>추출하기</strong>버튼을 클릭합니다.
              </li>
              <li>
                복사된 URL 을 <strong>Markdown</strong> 파일에서 사용합니다.
              </li>
            </div>
          </div>
          <div id="RepoTeamCard" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">Repo Team Card</p>
            <div>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                내 프로필 페이지에서 <strong>레포지토리</strong>를 클릭합니다.
              </li>
              <li>
                레포지토리 상세 페이지에서 <strong>추출하기</strong>버튼을 클릭합니다.
              </li>
              <li>
                복사된 URL 을 <strong>Markdown</strong> 파일에서 사용합니다.
              </li>
            </div>
          </div>
          <div id="RepoRersonalCard" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">Repo Personal Card</p>
            <div>
              <li>
                <strong>깃허브 로그인</strong>을 진행합니다.
              </li>
              <li>
                상단의 메뉴에서 <strong>내 프로필</strong>을 클릭합니다.
              </li>
              <li>
                내 프로필 페이지에서 <strong>레포지토리</strong>를 클릭합니다.
              </li>
              <li>
                레포지토리 상세 페이지에서 <strong>추출하기</strong>버튼을 클릭합니다.
              </li>
              <li>
                복사된 URL 을 <strong>Markdown</strong> 파일에서 사용합니다.
              </li>
            </div>
          </div>
        </div>

        {/* 레포몬 */}
        <div id="Repomon" className={`${styles.menu} pt-8`}>
          <p className="text-4xl  pb-5" style={{ color: `rgba(109, 130, 250, 1)`, fontWeight: '1000' }}>
            Repomon
          </p>
          <div id="Status" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold pb-3">Status</p>
            <li>
              레포몬의 스테이터스는 <strong>공격력, 치명타율, 방어율, 회피율, 명중률</strong> 다섯 가지로 구성됩니다.
            </li>
            <li>초기 스테이터스는 총합 30 내에서 주사위를 굴려 설정할 수 있습니다.</li>
            <li>해당 레포지토리의 경험치 100EXP당 스테이터스 포인트 1점을 획득할 수 있습니다. 해당 포인트는 원하는 스테이터스를 올리는 데 사용할 수 있습니다.</li>
            <li>레포몬의 최대 레벨은 1,000 입니다.</li>
            <li>체력은 기본값 100, 경험치 100 당 5가 올라갑니다. 임의의 포인트로 상승시킬 수 없습니다.</li>
            <li>방어율의 최대값은 90%입니다.</li>
            <li>기본 스테이터스와 포인트 당 스테이터스 상승량은 다음과 같습니다. (2023.05.10 기준)</li>

            <div className={`${styles.table} pl-5`}>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>공격력</th>
                    <th>방어율</th>
                    <th>회피율</th>
                    <th>치명타율</th>
                    <th>명중율</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>기본 스테이터스</td>
                    <td>10</td>
                    <td>10%</td>
                    <td>20%</td>
                    <td>10%</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <td>포인트 당 증가치</td>
                    <td>1</td>
                    <td>0.5%</td>
                    <td>0.5%</td>
                    <td>1%</td>
                    <td>1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div id="Battle" className={`${styles.menuItem} pb-5`}>
            <p className="text-xl font-bold py-3">Battle</p>
            <li>전투는 자동 전투로 진행됩니다.</li>
            <li>전투의 선 후공은 랜덤으로 정해집니다.</li>
            <li>공격 측은 공격, 치명타, 스킬 중 하나를 시전합니다.</li>
            <li>방어 측은 공격을 맞거나 회피율에 따라 회피할 수 있습니다.</li>
            <li>데미지는 공격력과 스탯에 비례한 랜덤 데미지의 합에 0.8~1.2 범위로 정해지며, 상대방의 방어율에 따라 차감되어 적용됩니다.</li>
            <li>스킬의 경우 5% 확률로 발동됩니다.</li>
            <li>스킬 데미지는 공격력과 스테이터스 합의 2배의 데미지가 적용되며, 방어하거나 회피할 수 없습니다.</li>
            <li>10턴이 경과할 시, 남은 체력의 비율에 따라 승/패가 결정됩니다.</li>
          </div>
        </div>
        <div className="pb-10"></div>
      </div>
    </div>
  );
}

export default Page;
