'use client';

import React, { useState } from "react";

export interface WithCounterProps {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const WithCounter = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithCounterProps>
) => {
  const ComponentWithCounter = (props: P) => {
    const [count, setCount] = useState(0);

    const increment = () => {
      setCount((prevCount) => prevCount + 1);
    };

    const decrement = () => {
      setCount((prevCount) => Math.max(0, prevCount - 1));
    };

    const reset = () => {
      setCount(0);
    };

    return (
      <WrappedComponent
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
        {...props}
      />
    );
  };

  ComponentWithCounter.displayName = `WithCounter(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithCounter;
};

export default WithCounter;