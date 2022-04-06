import { ThemeOverride } from "@chakra-ui/react";

type GlobalStyles = Pick<ThemeOverride, "styles">;

export default {
  styles: {
    global: {
      html: {
        fontSize: "18px",
        color: "white",
      },
    },
  },
} as GlobalStyles;
