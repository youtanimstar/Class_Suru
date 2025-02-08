import React, { useEffect, useId, useState, useTransition } from "react";
import toast, { Toaster } from "react-hot-toast";

import Style from "../../css/signup.module.css";
import GoogleIcon from "../../assets/google.svg";
import FacebookIcon from "../../assets/facebook.svg";

import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

import { Button } from "../../Components";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {jwtDecode} from 'jwt-decode';

import axios from "axios";

const Register = () => {
  // Redux Hooks
  const dispatch = useDispatch();
  const selectorStatus = useSelector((state) => state.user.status);

  // React Form Hook
  const id = useId();

  // React Router Hook
  const navigate = useNavigate();
  // UseState Hook
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(false);
  const [isPending, startTransition] = useTransition();

  
  // UseEffect Hook
  useEffect(()=>{
    if(selectorStatus){
      navigate("/");
    }
  },[navigate]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isPending);
    const loadingToastId = toast.loading("Loading...");
    startTransition(async () => {
      // setTimeout(() => {
      //   toast.dismiss(loadingToastId);
      //   toast.success("Signup Successful");
      //   setTimeout(() => {
      //     navigate("/questions");
      //   }, 2000);
      // }, 3000);

      

      try{
        const signup_response = await axios.post("http://localhost:5000/api/auth/signup",{
          username: name,
          email: email,
          phone_number: phone,
          password: password
          
        })
  
        if(signup_response.status === 201){
          toast.dismiss(loadingToastId);
          toast.success("Signup Successful");
          console.log(signup_response.data);

          const data = jwtDecode(signup_response.data.token);

          console.log("Decoed Token: ",data);
          

          
          
        }else{
          toast.dismiss(loadingToastId);
          toast.error("Signup Failed");
        }

      }catch(error){
        toast.dismiss(loadingToastId);
        toast.error(`${error.response.data.message}`);
      }

    });
  };
  return (
    <section className={Style.signupSection}>
      <div className={Style.signupContainer}>
        <div className={Style.signupOAuthSection}>
          <div className={Style.signupHeading}>Signup With</div>
          <div className={Style.signupOAuthContainer}>
            <div className={Style.signupOAuth}>
              <div className={Style.signupOAuthIcon}>
                <img src={GoogleIcon} alt="google icon" />
              </div>
              <div className={Style.signupOAuthText}>Google</div>
            </div>
            <div className={Style.signupOAuth}>
              <div className={Style.signupOAuthIcon}>
                <img src={FacebookIcon} alt="facebookIcon" />
                {/* <FacebookIcon/> */}
              </div>
              <div className={Style.signupOAuthText}>Facebook</div>
            </div>
          </div>
        </div>
        <div className={Style.orSection}>
          <div className={Style.orSectionLine}></div>
          <div className={Style.orSectionText}>or</div>
          <div className={Style.orSectionLine}></div>
        </div>
        <form className={Style.signupFormSection} onSubmit={handleSubmit}>
          <div className={Style.signupInputSection}>
            <label className={Style.signupInputLabel} htmlFor={id + "name"}>
              Name
            </label>
            <input
              className={Style.signupInput}
              type="text"
              name="name"
              id={id + "name"}
              placeholder="Jhone Doe"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={Style.signupInputSection}>
            <label className={Style.signupInputLabel} htmlFor={id + "email"}>
              Email
            </label>
            <input
              className={Style.signupInput}
              type="email"
              name="email"
              id={id + "email"}
              placeholder="jhon.doe@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={Style.signupInputSection}>
            <label className={Style.signupInputLabel} htmlFor={id + "phone"}>
              Phone
            </label>
            <div className={Style.phoneNumberContainer}>
              <div className={Style.countryCode}>+91</div>
              <input
                className={Style.signupInput}
                type="phone"
                name="phone"
                id={id + "phone"}
                placeholder="00000 00000"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={Style.signupInputSection}>
            <label className={Style.signupInputLabel} htmlFor={id + "password"}>
              Password
            </label>
            <div className={Style.passwordContainer}>
              <input
                className={Style.signupInput}
                type={eye ? "text" : "password"}
                name="password"
                placeholder="password"
                id={id + "password"}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className={`${Style.eye} ${eye ? Style.active : ""}`}
                onClick={() => setEye(!eye)}
              >
                {eye ? <FiEye /> : <FiEyeOff />}
              </div>
            </div>
          </div>
          <Button
            text="signup Now"
            className={Style.formBtn}
            type="submit"
            isLoading={isPending}
          />
        </form>
        <div className={Style.otherOption}>
          <div className={Style.otherOptionText}>have an account?</div>
          <Button
            text="Login Now"
            className={Style.registerBtn}
            isLink={true}
            link="/login"
          />
        </div>
      </div>
      <Toaster />
    </section>
  );
};

export default Register;
