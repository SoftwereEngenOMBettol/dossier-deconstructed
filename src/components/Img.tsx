import { useState } from "react";
import { placeholderFor, type PlaceholderKind } from "@/lib/placeholder";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackKind: PlaceholderKind;
  fallbackSeed: string;
  fallbackLabel?: string;
  fallbackSub?: string;
}

/**
 * Image that falls back to a themed SVG placeholder when the source is
 * missing, or when the blob/URL fails to decode as an image. Casepacks
 * frequently ship without per-item photos — this keeps every UI slot art
 * directed.
 */
export function Img({
  src,
  fallbackKind,
  fallbackSeed,
  fallbackLabel,
  fallbackSub,
  onError,
  ...rest
}: Props) {
  const placeholder = placeholderFor(fallbackKind, fallbackSeed, fallbackLabel, fallbackSub);
  const [current, setCurrent] = useState<string>(src || placeholder);
  return (
    <img
      {...rest}
      src={current}
      onError={(e) => {
        if (current !== placeholder) setCurrent(placeholder);
        onError?.(e);
      }}
    />
  );
}
