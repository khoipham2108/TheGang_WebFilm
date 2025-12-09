import React from "react";
import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";

type Props =
  | { name: string; Icon: IconType; to: string; onClick?: never }
  | { name: string; Icon: IconType; to?: never; onClick: () => void; active?: boolean };

const base =
  "flex items-center gap-2 text-sm md:text-base hover:opacity-90 transition-opacity";

const HeaderItem: React.FC<Props> = (p) => {
  const style = (active?: boolean) =>
    `${base} ${active ? "text-[var(--accent)]" : "text-[var(--text)]"}`;

  if ("to" in p) {
    return (
      <NavLink
        to={p.to}
        className={({ isActive }) => style(isActive)}
      >
        <p.Icon className="text-xl" />
        <span className="hidden md:inline">{p.name}</span>
      </NavLink>
    );
  }

  return (
    <button onClick={p.onClick} className={style(p.active)} aria-label={p.name}>
      <p.Icon className="text-xl" />
      <span className="hidden md:inline">{p.name}</span>
    </button>
  );
};

export default HeaderItem;
