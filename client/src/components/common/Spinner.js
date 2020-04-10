import React from "react";

export default function Spinner() {
  return (
    <div>
      <div className="spinner-border text-secondary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
