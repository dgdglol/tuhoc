import React from "react";
import './nghich.css';
import { WithCounterProps } from "./withcounter";

const Counter: React.FC<WithCounterProps> = ({ count, increment, decrement, reset }) => {
  return (
    <div className="container">
      <h2 className="title">Counter App</h2>
      <div className="count">{count}</div>
      <div className="buttons">
        <button onClick={increment} className="btn" aria-label="Tăng số lượng">+</button>
        <button
          onClick={decrement}
          className="btn"
          disabled={count <= 0}
          style={count <= 0 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          aria-label="Giảm số lượng"
        >
          -
        </button>
        <button onClick={reset} className="btn reset">Reset</button>
      </div>
    </div>
  );
};

export default Counter;