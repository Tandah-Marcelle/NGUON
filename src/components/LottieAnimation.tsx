import Lottie from "lottie-react";
import { CSSProperties, useRef, useEffect } from "react";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
  className?: string;
  renderer?: "svg" | "canvas" | "html";
  duration?: number;
}

const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  style,
  className = "",
  renderer = "svg",
  duration,
}: LottieAnimationProps) => {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (duration && lottieRef.current) {
      const timer = setTimeout(() => {
        lottieRef.current?.stop();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={style}
      className={className}
      renderer={renderer as any}
    />
  );
};

export default LottieAnimation;
