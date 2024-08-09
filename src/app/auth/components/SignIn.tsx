"use client"
import React,{useState} from 'react'
import OTPVerification from "./OTPVerification";
import SigninForm from "./SigninForm";

type Props = {}

const SignIn = (props: Props) => {

        const [verificationEmail, setVerificationEmail] = useState<string>('')
      
        return verificationEmail ? <OTPVerification email={verificationEmail} setEmail={setVerificationEmail} /> : <SigninForm setEmail={setVerificationEmail} />
      
}

export default SignIn