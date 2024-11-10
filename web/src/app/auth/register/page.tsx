"use client";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/stores/authStore";
import { RegisterDTO } from "@/models/auth";
import FormInput from "@/components/form-input";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuthStore((state) => state);
  const router = useRouter();

  const handleSubmit = (values: RegisterDTO) => {
    register(values).then(() => {
      // Toast success
      router.push("/auth/login");
    });
  };

  return (
    <div className="flex min-h-screen">
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
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            auth.register.title
          </h2>
          <Formik
            initialValues={{
              email: "",
              password: "",
              firstName: "",
              lastName: "",
            }}
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
                <div className="grid-cols-2 grid gap-2">
                  <FormInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="auth.form.first_name.placeholder"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.firstName}
                    error={errors.firstName}
                    value={values.firstName}
                  />
                  <FormInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="auth.form.last_name.placeholder"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.lastName}
                    error={errors.lastName}
                    value={values.lastName}
                  />
                </div>
                <FormInput
                  id="email"
                  name="email"
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
                  auth.register.submitButton
                </Button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-4 text-sm">
            auth.register.alreadyHaveAccount{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              auth.register.loginLink
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
