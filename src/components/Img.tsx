import { useEffect, useState } from "react";
import { placeholderFor, type PlaceholderKind } from "@/lib/placeholder";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackKind: PlaceholderKind;
  fallbackSeed: string;
  fallbackLabel?: string;
  fallbackSub?: string;
}

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
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  const finalSrc = !src || failed ? placeholder : src;
  return (
    <img
      {...rest}
      src={finalSrc}
      onError={(e) => {
        if (!failed) setFailed(true);
        onError?.(e);
      }}
    />
  );
}
