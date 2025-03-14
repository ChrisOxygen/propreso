import React, { useState, useEffect } from "react";

type ThreeDotsProps = {
  className?: string;
  speed?: number;
};

const ThreeDots: React.FC<ThreeDotsProps> = ({
  className = "",
  speed = 500,
}) => {
  const [state, setState] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prevState) => (prevState + 1) % 4);
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  const getDots = () => {
    switch (state) {
      case 0:
        return "•";
      case 1:
        return "••";
      case 2:
        return "•••";
      case 3:
        return "•••";
      default:
        return "•••";
    }
  };

  return <span className={`inline-block ${className}`}>{getDots()}</span>;
};

export default ThreeDots;
