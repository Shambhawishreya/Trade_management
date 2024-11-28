import React, { useState } from "react";
import Analytics from "./Analytics";
import Comparison from "./Comparison";
import './styles.css';

function Main() {
    const [view, setView] = useState("predict"); // Tracks whether to show Predict or Compare

    return (
        <div>
            <div className="button-group">
                <button
                    onClick={() => setView("predict")}
                    className={`toggle-button ${view === "predict" ? "active" : ""}`}
                >
                    Predict
                </button>
                <button
                    onClick={() => setView("compare")}
                    className={`toggle-button ${view === "compare" ? "active" : ""}`}
                >
                    Compare
                </button>
            </div>

            {view === "predict" ? <Analytics /> : <Comparison />}
        </div>
    );
}

export default Main;

