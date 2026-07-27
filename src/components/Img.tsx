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
  alt,
  onError,
  ...rest
}: Props) {
  const placeholder = placeholderFor(fallbackKind, fallbackSeed, fallbackLabel, fallbackSub);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  const finalSrc = !src || failed ? placeholder : src;
  const finalAlt =
    alt ?? [fallbackLabel, fallbackSub].filter(Boolean).join(" — ") ?? "";
  return (
    <img
      {...rest}
      alt={finalAlt}
      loading={rest.loading ?? "lazy"}
      decoding="async"
      src={finalSrc}
      onError={(e) => {
        if (!failed) setFailed(true);
        onError?.(e);
      }}
    />
  );
}
