"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import styles from "./DatePickerModal.module.scss";
import { dateFormat } from "@/app/utils/DateFormat";
import { ko } from "date-fns/locale";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { axiosRequestSetPeriod } from "@/api/repoDetail";
import { customAlert } from "@/app/utils/CustomAlert";

const customStyles = {
  content: {
    zIndex: "10000000",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "360px",
    height: "550px",
  },
};

const DatePickerModal = ({
  repoId,
  setIsUpdated,
}: {
  repoId: string;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [startDateForRequest, setStartDateForRequest] = useState<string>();
  const [endDateForRequest, setEndDateForRequest] = useState<string>();

  let footer = (
    <p
      style={{
        margin: "1rem 0 0 -0.5rem",
        fontWeight: "bold",
        color: "rgb(223, 62, 62)",
      }}
    >
      프로젝트 시작일을 선택해주세요.
    </p>
  );
  if (range?.from) {
    if (!range.to) {
      footer = (
        <p
          style={{
            margin: "1rem 0 0 -0.5rem",
          }}
        >
          시작일:
          <span style={{ color: "rgb(94, 130, 231)", fontWeight: "bold" }}>
            {startDateForRequest}
          </span>
        </p>
      );
    } else if (range.to) {
      footer = (
        <div className={styles["date-info-div"]}>
          <p>
            시작일: <span>{startDateForRequest}</span>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            종료일: <span>{endDateForRequest}</span>
          </p>
        </div>
      );
    }
  }

  /** ============================== useEffect ============================== */
  useEffect(() => {
    if (range && range.from) {
      setStartDateForRequest(dateFormat(range?.from as Date));
    }
    if (range && range.to) {
      setEndDateForRequest(dateFormat(range?.to as Date));
    }
  }, [range]);

  /** ============================== 함수, Event Handler ============================== */
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {};

  const closeModal = () => {
    setRange(undefined);
    setIsOpen(false);
  };

  const onClickApplyBtn = () => {
    if (!range || !range?.from || !range?.to) {
      customAlert("프로젝트의 시작일과 종료일을 선택해주세요.");
      return;
    }

    requestSetPeriod();
  };

  /** ============================== Axios ============================== */
  const requestSetPeriod = async () => {
    console.log(parseInt(repoId, 10), startDateForRequest, endDateForRequest);
    try {
      const res = await axiosRequestSetPeriod(
        parseInt(repoId, 10),
        startDateForRequest as string,
        endDateForRequest as string
      );
      console.log(res);
      setIsUpdated((prev) => !prev);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <CalendarDaysIcon
        onClick={openModal}
        type="button"
        className={styles.open}
      />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel=""
      >
        <p className={styles.title}>
          <span>프로젝트 기간 설정</span>
          <XMarkIcon onClick={closeModal} />
        </p>
        <DayPicker
          locale={ko}
          showOutsideDays
          fixedWeeks
          mode="range"
          defaultMonth={new Date()}
          selected={range}
          footer={footer}
          onSelect={setRange}
          modifiersClassNames={{
            selected: styles.selected,
          }}
          captionLayout="dropdown"
          fromYear={2000}
          toYear={2023}
          className={styles["day-picker"]}
        />
        <div className={styles["apply-div"]}>
          <button className={styles.apply} onClick={onClickApplyBtn}>
            적용
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DatePickerModal;
