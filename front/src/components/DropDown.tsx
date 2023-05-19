import React, { useEffect, useRef, useState } from "react";

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("필터");
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as HTMLElement) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as HTMLElement)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // 마우스 다운 이벤트에 대한 핸들러를 추가합니다.
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트가 언마운트될 때 핸들러를 제거합니다.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        style={{
          position: "absolute",
          textAlign: "center",
          zIndex: "100",
          width: "100%",
          fontSize: "1.2em",
          border: "1px solid grey",
          borderRadius: "10px 10px 0 0",
        }}
      >
        {selected}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            zIndex: "99",
            fontSize: "0.6em",
            textAlign: "center",
            width: "100%",
            top: 30,
            border: "1px solid grey",
            backgroundColor: "white",
          }}
        >
          <p
            style={{ cursor: "pointer" }}
            className="hover:bg-slate-200"
            onClick={() => (setSelected("최신순"), setIsOpen(false))}
          >
            최신순
          </p>
          <p
            style={{ cursor: "pointer" }}
            className="hover:bg-slate-200"
            onClick={() => (setSelected("가나다 순"), setIsOpen(false))}
          >
            가나다 순
          </p>
          <p
            style={{ cursor: "pointer" }}
            className="hover:bg-slate-200"
            onClick={() => (setSelected("오래된 순"), setIsOpen(false))}
          >
            오래된 순
          </p>
        </div>
      )}
    </div>
  );
}

export default DropDown;
