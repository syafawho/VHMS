import React from "react";
import { IconType } from "react-icons";

interface StyledIconProps {
  Icon: IconType;
  size?: string;
  color?: string;
  marginBottom?: string;
}

const StyledIcon: React.FC<StyledIconProps> = ({
  Icon,
  size = "3rem",
  color = "#fff",
  marginBottom = "10px",
}) => {
  return <Icon style={{ fontSize: size, color, marginBottom }} />;
};

export default StyledIcon;
