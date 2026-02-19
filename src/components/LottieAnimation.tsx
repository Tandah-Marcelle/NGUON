import Lottie from "lottie-react";
import { CSSProperties } from "react";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
  className?: string;
  renderer?: "svg" | "canvas" | "html";
}

const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  style,
  className = "",
  renderer = "svg",
}: LottieAnimationProps) => {
  return (
    <Lottie
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
