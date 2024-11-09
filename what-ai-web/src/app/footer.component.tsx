"use client";
import React from "react";
import { FaInstagram, FaGithub, FaYoutube, FaLinkedin } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="row-start-3 flex gap-4 flex-col flex-wrap items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-8 items-start w-5/6">
        {/* SOcials */}
        <div className="col-span-2 text-center sm:text-left">
          <h2 className="text-lg font-bold">{t("companyName")}</h2>
          <p className="text-sm text-gray-500">
            {t("welcome.subtext")}
          </p>
          <div className="flex gap-2.5 justify-center sm:justify-start mt-2">
            <a href="https://www.instagram.com/theo.frgs/" target="_blank">
              <FaInstagram size={24} className="hover:text-pink-600" />
            </a>
            <a
              href="https://www.linkedin.com/in/theo-fargeas-127046197/"
              target="_blank"
            >
              <FaLinkedin size={24} className="hover:text-blue-600" />
            </a>
            <a href="https://github.com/theofrgs/theofrgs" target="_blank">
              <FaGithub size={24} className="hover:text-gray-800" />
            </a>
            <a href="https://www.youtube.com/@theofrgs" target="_blank">
              <FaYoutube size={24} className="hover:text-red-500" />
            </a>
          </div>
        </div>

        {/* Solutions */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">{t("footer.solutions.title")}</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/cluster">
              {t("footer.solutions.cluster")}
            </a>
            <a className="hover:underline" href="/tag">
              {t("footer.solutions.tag")}
            </a>
            <a className="hover:underline" href="/cloud">
              {t("footer.solutions.cloud")}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">{t("footer.support.title")}</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/support/pricing">
              {t("footer.support.pricing")}
            </a>
            <a className="hover:underline" href="/support/documentation">
              {t("footer.support.documentation")}
            </a>
            <a className="hover:underline" href="/support/guides">
              {t("footer.support.guides")}
            </a>
            <a className="hover:underline" href="/support/api-status">
              {t("footer.support.status")}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">{t("footer.company.title")}</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/company/about">
              {t("footer.company.about")}
            </a>
            <a className="hover:underline" href="/company/career">
              {t("footer.company.career")}
            </a>
            <a className="hover:underline" href="/company/partners">
              {t("footer.company.partners")}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">{t("footer.legal.title")}</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/legal/privacy">
              {t("footer.legal.privacy")}
            </a>
            <a className="hover:underline" href="/legal/terms">
              {t("footer.legal.terms")}
            </a>
          </div>
        </div>
      </div>

      <div className="text-center pb-5">
        <p className="text-sm text-gray-500">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
