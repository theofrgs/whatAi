"use client";
import React from "react";
import { FaInstagram, FaGithub, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-4 flex-col flex-wrap items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-8 items-start w-5/6">
        {/* SOcials */}
        <div className="col-span-2 text-center sm:text-left">
          <h2 className="text-lg font-bold">companyName</h2>
          <p className="text-sm text-gray-500">welcome.subtext</p>
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
          <h4 className="font-bold">footer.solutions.title</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/cluster">
              footer.solutions.cluster
            </a>
            <a className="hover:underline" href="/tag">
              footer.solutions.tag
            </a>
            <a className="hover:underline" href="/cloud">
              footer.solutions.cloud
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">footer.support.title</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/support/pricing">
              footer.support.pricing
            </a>
            <a className="hover:underline" href="/support/documentation">
              footer.support.documentation
            </a>
            <a className="hover:underline" href="/support/guides">
              footer.support.guides
            </a>
            <a className="hover:underline" href="/support/api-status">
              footer.support.status
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">footer.company.title</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/company/about">
              footer.company.about
            </a>
            <a className="hover:underline" href="/company/career">
              footer.company.career
            </a>
            <a className="hover:underline" href="/company/partners">
              footer.company.partners
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start gap-3">
          <h4 className="font-bold">footer.legal.title</h4>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a className="hover:underline" href="/legal/privacy">
              footer.legal.privacy
            </a>
            <a className="hover:underline" href="/legal/terms">
              footer.legal.terms
            </a>
          </div>
        </div>
      </div>

      <div className="text-center pb-5">
        <p className="text-sm text-gray-500">footer.copyright</p>
      </div>
    </footer>
  );
}
