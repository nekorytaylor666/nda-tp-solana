import React from "react";
import { Button as BaseButton, ButtonProps } from "@chakra-ui/react";

export type IButton = ButtonProps;

export const Button: React.FC<IButton> = ({ ...rest }) => {
  return (
    <BaseButton
      bg="primaryBlue"
      textColor={"white"}
      fontSize="lg"
      fontWeight={"bold"}
      {...rest}
      data-testid="btn"
    />
  );
};
