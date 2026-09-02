import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { focusObjectPosition } from "@/lib/image-focus";

type OptimizedImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  fallbackClassName?: string;
  focusX?: number | null;
  focusY?: number | null;
};

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  focusX,
  focusY,
  style,
  ...props
}: OptimizedImageProps) {
  if (!src) {
    return <div className={cn("bg-primary/10", fallbackClassName, className)} />;
  }

  const objectPosition =
    focusX != null || focusY != null
      ? focusObjectPosition(focusX, focusY)
      : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      style={{
        ...(objectPosition ? { objectPosition } : null),
        ...style,
      }}
      {...props}
    />
  );
}
