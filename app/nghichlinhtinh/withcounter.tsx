'use client';

import React, { useState } from "react";
const WithCounter = (WrappedComponent: React.ComponentType<any>) => {
    return function Withcounter(props: any) {
        const [count, setCount] = useState(0);

        const increment = () => {
            setCount((prevCount) => prevCount + 1);
        };
        const decrement = () => {
            setCount((prevCount) => prevCount - 1);
        };
        const reset = () => {
            setCount(0);
        }
        return (
            <WrappedComponent count={count} increment={increment} decrement={decrement} reset={reset} {...props} />
        );
    };
};
export default WithCounter;