"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";

const Page = () => (
  <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    onSubmit={signInWithCredentials}
    defaultValues={{
      email: "",
      password: "",
    }}
  />
);

export default Page;
