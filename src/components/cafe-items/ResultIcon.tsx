import { XSVG } from "../svgs/XSVG";
import { CheckSVG } from "../svgs/CheckSVG";
import type { OrderItem } from "../../types";

type ResultIconProps = {
  showFailMessage: boolean;
  item: OrderItem;
};

export const ResultIcon = ({ showFailMessage, item }: ResultIconProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {item.result === "success" ? (
        <div>
          <CheckSVG colour={"#1fff35"} width={28} />
        </div>
      ) : item.result === "fail" && showFailMessage ? (
        <div>
          <XSVG colour={"#ff1f1f"} width={28} />
        </div>
      ) : null}
    </div>
  );
};
