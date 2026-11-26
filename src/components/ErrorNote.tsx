import React from "react";
import { Text } from "react-native";
import { cx } from "../i18n";

export function ErrorNote({ error, notice }: { error?: string; notice?: string }) {
  return (
    <>
      {!!error && <Text accessibilityRole="alert" className={cx("bg-red-50 text-red-700 rounded-xl p-3 mb-3 text-right")}>{error}</Text>}
      {!!notice && <Text className={cx("bg-green-50 text-green-800 rounded-xl p-3 mb-3 text-right")}>{notice}</Text>}
    </>
  );
}
