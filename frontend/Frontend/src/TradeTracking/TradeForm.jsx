import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TradeForm.css";
import TradeNavBar from './TradeNavBar'
import GlobeIcon from "../assets/globe.svg";
import TradeIcon from "../assets/trade.svg";
import TradeIcon2 from "../assets/trade2.svg";
import TradeIcon3 from "../assets/trade3.svg";
const marketOptions = [
  "Agriculture",
  "Cryptocurrencies",
  "Energy",
  "Interest Rate",
  "Metals",
  "Equities",
  "FX",
  "Real Estate",
  "Weather",
];

const Step1 = ({ register, errors }) => {
  const [marketInput, setMarketInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOptions = marketOptions
    .filter((option) =>
      option.toLowerCase().includes(marketInput.toLowerCase())
    )
    .sort(
      (a, b) =>
        a.toLowerCase().indexOf(marketInput.toLowerCase()) -
        b.toLowerCase().indexOf(marketInput.toLowerCase())
    );

  const handleOptionSelect = (option) => {
    setMarketInput(option);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div>
        <label>Name of the product:</label>
        <input {...register("name", { required: "Name is required" })} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Ticker/Globex Code:</label>
        <input {...register("ticker", { required: "Ticker is required" })} />
        {errors.ticker && <p>{errors.ticker.message}</p>}
      </div>
      <div>
        <label>Market/Asset Class:</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            {...register("market", { required: "Market is required" })}
            value={marketInput}
            onChange={(e) => {
              setMarketInput(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Select or type market"
          />
          {isDropdownOpen && marketInput && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ccc",
                backgroundColor: "white",
                zIndex: 10,
              }}
            >
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    ":hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          {errors.market && <p>{errors.market.message}</p>}
        </div>
      </div>
      <div>
        <label>Open Price:</label>
        <input
          type="number"
          step="any"
          {...register("open", { required: "Open price is required" })}
        />
        {errors.open && <p>{errors.open.message}</p>}
      </div>
    </>
  );
};

const Step2 = ({ register, errors }) => (
  <>
    <div>
      <label>High Price:</label>
      <input
        type="number"
        step="any"
        {...register("high", { required: "High price is required" })}
      />
      {errors.high && <p>{errors.high.message}</p>}
    </div>
    <div>
      <label>Low Price:</label>
      <input
        type="number"
        step="any"
        {...register("low", { required: "Low price is required" })}
      />
      {errors.low && <p>{errors.low.message}</p>}
    </div>
    <div>
      <label>Last Price:</label>
      <input
        type="number"
        step="any"
        {...register("last", { required: "Last price is required" })}
      />
      {errors.last && <p>{errors.last.message}</p>}
    </div>
    <div>
      <label>Settle Price:</label>
      <input
        type="number"
        step="any"
        {...register("settle", { required: "Settle price is required" })}
      />
      {errors.settle && <p>{errors.settle.message}</p>}
    </div>
  </>
);

const Step3 = ({ register, errors }) => (
  <>
    <div>
      <label>Change in Price:</label>
      <input
        type="number"
        step="any"
        {...register("change", { required: "Change value is required" })}
      />
      {errors.change && <p>{errors.change.message}</p>}
    </div>
    <div>
      <label>Estimated Volume:</label>
      <input
        type="number"
        {...register("estVolume", { required: "Estimated volume is required" })}
      />
      {errors.estVolume && <p>{errors.estVolume.message}</p>}
    </div>
    <div>
      <label>Timestamp/Time of Trade:</label>
      <input
        type="datetime-local"
        {...register("timestamp", { required: "Timestamp is required" })}
      />
      {errors.timestamp && <p>{errors.timestamp.message}</p>}
    </div>
  </>
);

const TradeForm = () => {
  const methods = useForm();
  const menuItems2 = [
    {
      label: "Trade History",
      icon: TradeIcon,
      path: "/all",
    },
    {
      label: "Live Trades",
      icon: TradeIcon2,
      path: "/today",
    },
    {
      label: "Trade Register",
      icon: TradeIcon3,
      path: "/traderegister",
    },
  ];
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    trigger,
  } = methods;
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Register Trade", path: "/traderegister" },
    { label: "View Trades", path: "/trades" },
  ];
  const handleMenuItemClick = (item) => {
    window.location.href = item.path;
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        open: parseFloat(data.open),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        last: parseFloat(data.last),
        settle: parseFloat(data.settle),
        change: parseFloat(data.change),
        estVolume: parseInt(data.estVolume, 10),
        timestamp: new Date(data.timestamp).toISOString(),
      };
      const response = await axios.post(
        "http://localhost:8000/api/register/register-trade",
        formattedData
      );
      if (response.status === 201) {
        alert("Trade successfully created!");
        reset(); // Clear all form fields
        setStep(1); // Navigate back to the first step
        navigate("/traderegister");
      }
    } catch (error) {
      console.error(
        "Error creating trade:",
        error.response?.data || error.message
      );
      alert("Failed to create trade. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 register={register} errors={errors} />;
      case 2:
        return <Step2 register={register} errors={errors} />;
      case 3:
        return <Step3 register={register} errors={errors} />;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    // Validate the current step's fields
    const isStepValid = await trigger(); // Validates all fields in the current step
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="alltrades">
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Register Trade Data</h1> {/* Centered title */}
          {renderStep()}
          <div className="form-buttons">
            {step > 1 && (
              <button type="button" onClick={handleBack}>
                Back
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={handleNext}>
                Next
              </button>
            )}
            {step === 3 && <button type="submit">Submit</button>}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default TradeForm;
