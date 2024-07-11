import React, { useState, useRef, useEffect } from "react";
import MetaData from "../layout/MetaData";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { useVerifyMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Verify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [verify, { isLoading, error, data }] = useVerifyMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

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
    const signUpData = { email, otp: +otpValue };
    console.log("signup data", signUpData);
    verify(signUpData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (data) {
      toast.success("Xác thực thành công");
      navigate("/");
      console.log("Verification successful");
    }
    if (error) {
      console.error("Verification failed");
    }
  }, [data, error, isAuthenticated]);

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
                    disabled={index !== 0}
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

export default Verify;
