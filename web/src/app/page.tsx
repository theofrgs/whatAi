"use client";

import { Button } from "@/components/ui/button";
import Footer from "./footer.component";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-semi text-gray-500 text-center mb-10">
          welcome.heading
        </h1>
        <h6 className="text-4xl font-bold text-center mb-10">
          welcome.subtext
        </h6>
        <div className="mb-20">
          <Button
            onClick={() => router.push("/auth/login")}
            size="lg"
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl text-xl"
          >
            Start
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
