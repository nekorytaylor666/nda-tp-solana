import { extendTheme } from "@chakra-ui/react";

import styles from "./styles";

import colors from "./foundations/colors";

import fontSizes from "./foundations/fontSizes";
import fonts from "./foundations/font";

const overrides = {
  ...styles,
  colors,
  fontSizes,
  fonts,
};

const theme = extendTheme(overrides);

export default theme;
