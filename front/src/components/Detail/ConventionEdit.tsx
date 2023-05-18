"use client";

import { EditConventionType } from "@/types/repoDetail";
import React, { useEffect, useState } from "react";
import styles from "./ConventionEdit.module.scss";
import { axiosRequestEditConventions } from "@/api/repoDetail";

const ConventionEdit = ({
  exConventions,
  setEditMode,
  setConventionUpdated,
  repoId,
}: {
  exConventions: EditConventionType[];
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setConventionUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  repoId: string;
}) => {
  const [conventions, setConventions] =
    useState<EditConventionType[]>(exConventions);
  const [prefix, setPrefix] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [edittingPrefix, setEdittingPrefix] = useState<string>("");
  const [edittingDescription, setEdittingDescription] = useState<string>("");

  useEffect(() => {}, [conventions]);

  const onChangePrefix = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.target.value);
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onChangeEdittingPrefix = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdittingPrefix(e.target.value);
  };

  const onChangeEdittingDescription = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEdittingDescription(e.target.value);
  };

  const onClickAddBtn = () => {
    if (prefix.trim() === "" || description.trim() === "") {
      return;
    }

    const newConvention = {
      id: conventions.length + 1,
      prefix,
      description,
      isEditting: false,
    };

    setConventions([...conventions, newConvention]);
    setPrefix("");
    setDescription("");
  };

  const handleDeleteConvention = (id: number) => {
    setConventions(conventions.filter((convention) => convention.id !== id));
  };

  const onKeyDownAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onClickAddBtn();
    }
  };

  const onClickEditBtn = (
    id: number,
    newPrefix: string,
    newDescription: string
  ) => {
    setConventions(
      conventions.map((convention) =>
        convention.id === id
          ? {
              ...convention,
              isEditting: true,
            }
          : {
              ...convention,
              isEditting: false,
            }
      )
    );

    setEdittingPrefix(newPrefix);

    setEdittingDescription(newDescription);
  };

  const onClcikEditCancle = (id: number) => {
    setConventions(
      conventions.map((convention) =>
        convention.id === id
          ? {
              ...convention,
              isEditting: false,
            }
          : convention
      )
    );
  };

  const onClickEditApplyBtn = (
    id: number,
    newPrefix: string,
    newDescription: string
  ) => {
    setConventions(
      conventions.map((convention) =>
        convention.id === id
          ? {
              ...convention,
              prefix: newPrefix,
              description: newDescription,
              isEditting: false,
            }
          : convention
      )
    );
  };

  const onKeyDownEditting = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    newPrefix: string,
    newDescription: string
  ) => {
    if (e.key === "Enter") {
      onClickEditApplyBtn(id, newPrefix, newDescription);
    } else if (e.key === "Escape") {
      onClcikEditCancle(id);
    }
  };

  const onClickEditModeOffBtn = () => {
    setEditMode(false);
  };

  const onClickEditModeApplyBtn = async () => {
    try {
      const res = await axiosRequestEditConventions(repoId, conventions);
      setConventionUpdated((prev) => !prev);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.line} ${styles["title-line"]}`}>
        <p>커밋 헤더</p>
        <p>설명</p>
        <p> </p>
      </div>
      <div>
        {conventions.map((convention) => (
          <>
            {!convention.isEditting && (
              <div
                key={convention.id}
                className={`${styles.line} ${styles["item-line"]}`}
              >
                <p>{convention.prefix}</p>
                <p>{convention.description}</p>
                <div className={styles["btn-div"]}>
                  <button
                    onClick={() =>
                      onClickEditBtn(
                        convention.id,
                        convention.prefix,
                        convention.description
                      )
                    }
                  >
                    수정
                  </button>
                  <button onClick={() => handleDeleteConvention(convention.id)}>
                    삭제
                  </button>
                </div>
              </div>
            )}
            {convention.isEditting && (
              <div className={`${styles.line} ${styles["edit-item-line"]}`}>
                <input
                  type="text"
                  value={edittingPrefix}
                  onChange={onChangeEdittingPrefix}
                  onKeyDown={(e) =>
                    onKeyDownEditting(
                      e,
                      convention.id,
                      edittingPrefix,
                      edittingDescription
                    )
                  }
                  style={{ paddingLeft: "0.5rem" }}
                />
                <input
                  type="text"
                  value={edittingDescription}
                  onChange={onChangeEdittingDescription}
                  onKeyDown={(e) =>
                    onKeyDownEditting(
                      e,
                      convention.id,
                      edittingPrefix,
                      edittingDescription
                    )
                  }
                />
                <div className={styles["btn-div"]}>
                  <button
                    onClick={() =>
                      onClickEditApplyBtn(
                        convention.id,
                        edittingPrefix,
                        edittingDescription
                      )
                    }
                  >
                    적용
                  </button>
                  <button onClick={() => onClcikEditCancle(convention.id)}>
                    취소
                  </button>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
      <div className={`${styles.line} ${styles["input-item-line"]}`}>
        <input
          type="text"
          placeholder="커밋 헤더 입력"
          value={prefix}
          onChange={onChangePrefix}
          style={{ paddingLeft: "0.5rem" }}
          onKeyDown={(e) => onKeyDownAdd(e)}
        />
        <input
          type="text"
          placeholder="헤더 설명 입력"
          value={description}
          onChange={onChangeDescription}
          onKeyDown={(e) => onKeyDownAdd(e)}
        />
        <div className={styles["btn-div"]}>
          <button onClick={onClickAddBtn}>추가</button>
        </div>
      </div>
      <div className={styles["container-btn-div"]}>
        <button
          className={styles["container-cancel"]}
          onClick={onClickEditModeOffBtn}
        >
          취소
        </button>
        <button
          className={styles["container-apply"]}
          onClick={onClickEditModeApplyBtn}
        >
          적용
        </button>
      </div>
    </div>
  );
};

export default ConventionEdit;
