import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosBattle } from "../api/api";
import Loading from "../components/Loading";
import { BattleHpLogType, BattleType } from "../types/type";
import { pretreatModelUrl } from "../utils/PretreatModelUrl";
import styles from "./Battle.module.scss";
import { AiOutlineRollback } from "react-icons/ai";

function Battle() {
  const location = useLocation();
  const navigate = useNavigate();
  const repoId = location.state.repoId;
  const oppoId = location.state.oppoId;
  const [battleInfo, setBattleInfo] = useState<BattleType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [hpLog, setHpLog] = useState<BattleHpLogType[]>();

  useEffect(() => {
    battle();
  }, []);

  useEffect(() => {
    if (battleInfo) {
      calcHp();
    }
  }, [battleInfo]);

  const calcHp = () => {
    if (!battleInfo) {
      return;
    }

    let hp = battleInfo.attackRepo.hp;
    let oppoHp = battleInfo.defenseRepo.hp;
    let tmpHpLog: BattleHpLogType[] = [];

    for (let i = 0; i < battleInfo.battleLog.length; i++) {
      const damage = Math.ceil(battleInfo.battleLog[i].damage);
      if (battleInfo.battleLog[i].attacker === repoId) {
        oppoHp = oppoHp - damage >= 0 ? oppoHp - damage : 0;
      } else if (battleInfo.battleLog[i].defender === repoId) {
        hp = hp - damage >= 0 ? hp - damage : 0;
      }

      tmpHpLog.push({ hp, oppoHp });
    }

    setHpLog(tmpHpLog);
  };

  const battle = async () => {
    try {
      const res = await axiosBattle(repoId, oppoId);
      console.log("배틀!!!: ", res);
      setBattleInfo(res.data.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading && (
        <div className={styles["loading-container"]}>
          <Loading />
        </div>
      )}
      {!loading && battleInfo && (
        <div className={styles.container}>
          <div className={styles["repomon-div"]}>
            <div className={styles.repomon}>
              <img
                src={`/models_png/${pretreatModelUrl(
                  battleInfo?.attackRepo.repomon.repomonUrl
                )}.png`}
                alt=""
              />
              <p>{battleInfo?.attackRepo.repomonNickname}</p>
            </div>
            <div className={styles.vs}>
              <span>VS</span>
            </div>
            <div className={styles.repomon}>
              <img
                src={`/models_png/${pretreatModelUrl(
                  battleInfo.defenseRepo.repomon.repomonUrl
                )}.png`}
                alt=""
              />
              <p>{battleInfo.defenseRepo.repomonNickname}</p>
            </div>
          </div>
          <div className={styles.log}>
            {battleInfo.battleLog.map((turn, index) => (
              <div key={index} className={styles["log-item"]}>
                <p className={styles.turn}>{turn.turn}턴</p>
                <p>{turn.attack_log}</p>
                <p>{turn.defense_log}</p>
                {hpLog && (
                  <div className={styles["hp-log"]}>
                    <p>
                      {battleInfo.attackRepo.repomonNickname} HP:{" "}
                      <span>
                        {hpLog[index].hp}
                        {turn.damage > 0 && turn.attacker === oppoId && (
                          <span className={styles.hp}>
                            (- {Math.ceil(turn.damage)})
                          </span>
                        )}
                      </span>
                    </p>
                    <p>
                      {battleInfo.defenseRepo.repomonNickname} HP:{" "}
                      <span>
                        {hpLog[index].oppoHp}
                        {turn.damage > 0 && turn.attacker === repoId && (
                          <span className={styles.hp}>
                            (- {Math.ceil(turn.damage)})
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div className={styles.result}>
              {battleInfo.isWin ? (
                <p className={styles.win}>승리 (+{battleInfo.attackPoint}) </p>
              ) : (
                <p className={styles.lose}>패배 ({battleInfo.attackPoint})</p>
              )}
            </div>
          </div>
          <p
            className={styles.back}
            onClick={() => {
              navigate("/main");
            }}
          >
            <AiOutlineRollback />
            뒤로가기
          </p>
        </div>
      )}
    </div>
  );
}

export default Battle;
