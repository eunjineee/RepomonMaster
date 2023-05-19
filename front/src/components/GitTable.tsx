`use client`;

import { conventionType } from "@/types/repoRegist";
import React, { useEffect, useState } from "react";

type propsData = {
  setConventionData: React.Dispatch<React.SetStateAction<conventionType[]>>;
};

function GitTable(props: propsData) {
  const [commits, setCommits] = useState<conventionType[]>([
    { type: "", desc: "" },
  ]);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    const convertedCommits = commits.slice(1).map((commit) => ({
      type: commit.type,
      desc: commit.desc,
    }));
    props.setConventionData(convertedCommits);
  }, [commits]);

  const handleAddCommit = () => {
    if (type.trim() !== "") {
      const newCommit: conventionType = {
        type: type.trim(),
        desc: description.trim(),
      };
      setCommits([...commits, newCommit]);
      setType("");
      setDescription("");
    }
    const lastRowIndex = commits.length;
    const lastRowButton = document.querySelector(
      `tr:nth-child(${lastRowIndex + 1}) td:last-child button`
    );
    if (lastRowButton) {
      lastRowButton.textContent = "삭제";
    }
  };

  const handleDeleteCommit = (index: number) => {
    const filteredCommits = commits.filter((_, i) => i !== index + 1);
    setCommits(filteredCommits);
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "80%", marginTop: "8%" }}>
        <table
          className="w-full text-center text-sm font-light"
          style={{ position: "relative" }}
        >
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "75%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead className="border-b bg-zinc-500 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
            <tr>
              <th scope="col" className=" px-6 py-4">
                커밋 헤더
              </th>
              <th scope="col" className=" px-6 py-4">
                설명
              </th>
              <th scope="col" className=" px-6 py-4">
                삭제
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "white" }}>
            {commits.slice(1).map((commit, index) => (
              <tr key={index} className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap  px-6 py-4 font-medium">
                  {commit.type}
                </td>
                <td
                  className="whitespace-nowrap  px-6 py-4"
                  style={{ textAlign: "left" }}
                >
                  {commit.desc}
                </td>
                <td className="whitespace-nowrap  px-6 py-4">
                  <button onClick={() => handleDeleteCommit(index)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-b dark:border-neutral-500">
              <td
                className="whitespace-nowrap  px-6 py-4 font-medium"
                style={{ width: "20%" }}
              >
                <input
                  className="border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                  style={{
                    color: "black",
                    width: "100%",
                    textAlign: "center",
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="헤더 입력(선택)"
                />
              </td>
              <td className="whitespace-nowrap  px-6 py-4">
                <input
                  className="border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                  style={{
                    color: "black",
                    width: "100%",
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="헤더 설명 입력(선택)"
                />
              </td>
              <td
                className="whitespace-nowrap  px-6 py-4"
                onClick={handleAddCommit}
                style={{ cursor: "pointer" }}
              >
                추가
              </td>
            </tr>
          </tbody>
          <div
            style={{
              position: "absolute",
              top: "-3em",
              backgroundColor: "#A1CDFF",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "18%",
              height: "3em",
              borderRadius: "10px 10px 0 0",
              fontWeight: "700",
              fontSize: "1.1em",
            }}
          >
            커밋 컨벤션
          </div>
        </table>
      </div>
    </div>
  );
}

export default GitTable;
