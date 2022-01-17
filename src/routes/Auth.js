import React from "react";
import { authService, firebaseInstance } from "../firebase";
import AuthForm from "../components/AuthForm";

const Auth = () => {
  const socialLogin = async (event) => {
    const {
      target: { name },
    } = event;

    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "facebook") {
      provider = new firebaseInstance.auth.FacebookAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button name="google" onClick={socialLogin}>
          Continue with Google
        </button>
        <button name="facebook" onClick={socialLogin}>
          Continue with FaceBook
        </button>
      </div>
    </div>
  );
};
export default Auth;
