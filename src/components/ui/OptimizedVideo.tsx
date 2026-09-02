import { cn } from "@/lib/utils";

type OptimizedVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
};

/** Lightweight video playback defaults for fast page loads. */
export function OptimizedVideo({
  src,
  className,
  poster,
  ...props
}: OptimizedVideoProps) {
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={cn(className)}
      {...props}
    />
  );
}
