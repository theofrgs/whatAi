"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footer from "./footer.component";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  const features: {
    title: string;
    description: string;
    image?: string;
    color: string;
  }[] = [
    {
      title: t("home.features.imageGrouping.title"),
      description: t("home.features.imageGrouping.description"),
      // image: "/images/image-grouping.png",
      color: "bg-green-600",
    },
    {
      title: t("home.features.contentTagging.title"),
      description: t("home.features.contentTagging.description"),
      // image: "/images/content-tagging.png",
      color: "bg-purple-600",
    },
    {
      title: t("home.features.cloudIntegration.title"),
      description: t("home.features.cloudIntegration.description"),
      // image: "/images/cloud-integration.png",
      color: "bg-blue-600",
    },
  ];
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-semi text-gray-500 text-center mb-10">
          {t("welcome.heading")}
        </h1>
        <h6 className="text-4xl font-bold text-center mb-10">
          {t("welcome.subtext")}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  w-5/6">
          {features.map(({ image, title, description, color }, index) => (
            <div
              key={index}
              className={`${color} p-5 rounded-lg shadow-lg gap-2 overflow-hidden flex-col flex justify-between`}
            >
              {image && (
                <Image
                  src={image}
                  alt={title}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="text-gray-200 h-full">{description}</p>
              <div>
                <Button variant={"ghost"} className="mt-4 text-white">{t("home.learnMore")}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
