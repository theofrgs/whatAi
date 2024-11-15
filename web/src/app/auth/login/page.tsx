"use client";

import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/stores/authStore";
import { LoginDTO } from "@/models/auth";
import FormInput from "@/components/form-input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuthStore((state) => state);
  const router = useRouter();

  const handleSubmit = useCallback((values: LoginDTO) => {
    login(values).then(() => {
      // Toast success
      router.push("/conversation");
    });
  }, [login, router]);

  return (
    <div className="flex min-h-screen w-screen">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-10 items-center justify-center hidden md:flex w-1/2">
        <div className="text-white">
          <h1 className="text-4xl font-bold">welcome.heading</h1>
          <p className="mt-4">welcome.subtext</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-gray-50 w-full md:w-1/2 gap-4">
        <div className="flex md:hidden flex-col text-black text-center">
          <h1 className="text-4xl font-bold">welcome.heading</h1>
          <p className="mt-4">welcome.subtext</p>
        </div>
        <div className="md:bg-white p-8 rounded-lg md:shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            auth.login.title
          </h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("auth.validation.invalidEmail")
                .required("auth.validation.required"),
              password: Yup.string().required("auth.validation.required"),
            })}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, errors, touched, values }) => (
              <Form className="gap-2 flex flex-col">
                <FormInput
                  id="email"
                  name="email"
                  autoComplete={"email"}
                  type="text"
                  placeholder="auth.form.email.placeholder"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.email}
                  error={errors.email}
                  value={values.email}
                />
                <FormInput
                  id="password"
                  name="password"
                  autoComplete={"password"}
                  type="password"
                  placeholder="auth.form.password.placeholder"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.password}
                  error={errors.password}
                  value={values.password}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 my-2 rounded-lg"
                >
                  auth.login.submitButton
                </Button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-4 text-sm">
            auth.login.noAccount{" "}
            <Link
              href="/auth/register"
              className="text-blue-500 hover:underline"
            >
              auth.login.registerLink
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
