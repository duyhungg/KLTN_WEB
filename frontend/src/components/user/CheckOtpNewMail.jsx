import React, { useState, useRef, useEffect } from "react";
import MetaData from "../layout/MetaData";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCheckOtpNewMailMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";

const ChangeMail = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [checkOtpNewMail, { isLoading, isSuccess, error, data }] =
    useCheckOtpNewMailMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        inputRefs.current[index + 1].disabled = false;
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        inputRefs.current[index - 1].disabled = false;
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].focus();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    const signUpData = { otp: +otpValue };
    console.log("dataRequest", otpValue);
    checkOtpNewMail(signUpData);
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Verification failed");
      console.error("Verification failed");
    }
    if (isSuccess) {
      navigate(`/me/profile`);
      console.log("success");
    }
  }, [data, error, isAuthenticated, isSuccess, navigate]);

  return (
    <>
      <MetaData title={"Verify your account"} />
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card bg-white mb-5 mt-5 border-0">
            <div className="card-body p-5 text-center">
              <h4>Verify</h4>
              <p>Your code was sent to your email</p>

              <div className="otp-field mb-4 d-flex justify-content-center">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onClick={() => handleClick(index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    disabled={index !== 0 && !otp[index - 1]} // Chỉ disable nếu không có giá trị ở input trước đó
                    className="form-control mx-1 text-center"
                    style={{ width: "40px", height: "40px", fontSize: "18px" }}
                  />
                ))}
              </div>

              <button
                className="btn btn-primary mb-3"
                onClick={submitHandler}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
              {error && (
                <p className="text-danger">
                  Verification failed. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeMail;
