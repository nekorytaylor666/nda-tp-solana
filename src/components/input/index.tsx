import { Input as BaseInput, InputProps } from "@chakra-ui/react";

export type IInput = InputProps;

export const Input: React.FC<IInput> = ({ ...rest }) => {
  return <BaseInput border="none" bg="darkGray" {...rest}></BaseInput>;
};
