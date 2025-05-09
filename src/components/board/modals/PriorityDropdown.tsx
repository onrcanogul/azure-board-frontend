import { useState, useRef, useEffect } from "react";

interface PriorityDropdownProps {
  value: number;
  onChange: (v: number) => void;
}

const PriorityDropdown = ({ value, onChange }: PriorityDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        minWidth: 60,
        width: 80,
        background: "#232422",
        color: "#fff",
        border: "1px solid #444",
        borderRadius: 3,
        fontSize: 15,
        padding: "4px 8px",
        textAlign: "center",
        cursor: "pointer",
        margin: "0 auto",
      }}
      onClick={() => setOpen((o) => !o)}
    >
      {value}
      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "100%",
            background: "#232422",
            border: "1px solid #444",
            borderRadius: 3,
            width: "100%",
            zIndex: 10,
          }}
        >
          {[1, 2, 3].map((p) => (
            <div
              key={p}
              style={{
                padding: "6px 0",
                color: "#fff",
                background: value === p ? "#333" : "transparent",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(p);
                setOpen(false);
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityDropdown;
