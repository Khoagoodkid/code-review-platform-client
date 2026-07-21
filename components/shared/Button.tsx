"use client";

import { Button as RadixButton } from "@radix-ui/themes";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof RadixButton>;

export function Button(props: ButtonProps) {
  return <RadixButton {...props} />;
}
