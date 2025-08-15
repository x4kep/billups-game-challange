import { memo } from "react";
import "./CurrentUser.css";

type Props = {
  playerName: string;
  className?: string;
};

const CurrentUser = memo(function CurrentUser({
  playerName,
  className,
}: Props) {
  return (
    <div className={`current-user ${className || ""}`}>
      <span className="current-user__label">You:</span>
      <span className="current-user__name">{playerName}</span>
    </div>
  );
});

export default CurrentUser;
