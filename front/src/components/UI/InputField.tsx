import { axiosRequestCheckNicknameDuplicated } from "@/api/repoDetail";
import React, { useEffect, useState } from "react";

type InputProps = {
  setRepoName: React.Dispatch<React.SetStateAction<string>>;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
};

function InputField(props: InputProps) {
  const [name, setName] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isDuplicated, setIsDuplicated] = useState<boolean>(false);
  const [isGoodtoUse, setIsGoodTouse] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  function handleInputField(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setIsEmpty(true);
      setName(e.target.value);
    } else {
      setIsEmpty(false);
      setIsDuplicated(false);
      setIsGoodTouse(false);
      setIsCompleted(false);
      setName(e.target.value);
    }
  }

  async function checkDuplicated() {
    try {
      const res = await axiosRequestCheckNicknameDuplicated(name);
      if (res.data) {
        setIsGoodTouse(true);
        setIsCompleted(true);
      }
    } catch (error) {
      setIsDuplicated(true);
      setIsGoodTouse(false);
      setIsCompleted(false);
    }
  }

  useEffect(() => {
    if (name.length === 0) {
      setIsDuplicated(false);
      setIsCompleted(false);
      setIsGoodTouse(false);
    }
  }, [name]);

  useEffect(() => {
    props.setIsReady(isDisabled);
  }, [isDisabled]);

  return (
    <form className="flex items-center" style={{ width: "70%" }}>
      <div className="flex items-center border-b border-sky-500 py-2 w-100">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="이름 입력..."
          aria-label="Full name"
          value={name || ""}
          onChange={handleInputField}
          disabled={isDisabled}
        />
        <button
          className={`flex-shrink-0 ${
            isDisabled
              ? "bg-sky-700 border-sky-700"
              : "bg-sky-300 hover:bg-sky-700 border-sky-300 hover:border-sky-700"
          } text-sm border-4 text-white py-1 px-2 rounded`}
          type="button"
          disabled={isDisabled}
          onClick={() => {
            !isDuplicated && isGoodtoUse && isCompleted && !isEmpty
              ? (props.setRepoName(name),
                setIsDisabled(true),
                console.log("확정됨"))
              : (checkDuplicated(), setIsDuplicated(false));
          }}
        >
          {isGoodtoUse &&
          name !== "" &&
          !isDuplicated &&
          isCompleted &&
          !isEmpty
            ? isDisabled
              ? "확정됨"
              : "확정"
            : "중복검사"}
        </button>

        <button
          className="flex-shrink-0 border-transparent border-4 text-sky-500 hover:text-sky-800 text-sm py-1 px-2 rounded"
          type="button"
          disabled={isDisabled}
          onClick={() => {
            setName("");
          }}
        >
          비우기
        </button>
      </div>
      {!isEmpty ? (
        isDuplicated ? (
          <label className="text-sm text-red-500 ml-5">
            중복된 이름입니다.
          </label>
        ) : isGoodtoUse ? (
          <label className="text-sm text-sky-500 ml-5">
            사용해도 좋은 이름입니다.
          </label>
        ) : null
      ) : (
        <label className="text-sm text-red-500 ml-5">
          공백은 등록할 수 없습니다.
        </label>
      )}
    </form>
  );
}

export default InputField;
