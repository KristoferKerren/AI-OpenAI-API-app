"use client";

import { assistantAtom, fileAtom, messagesAtom } from "@/atom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAtom } from "jotai";
import { Assistant } from "openai/resources/beta/assistants/assistants.mjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-blue-800 text-white p-4">
      <div className="container flex flex-row justify-around mx-auto ">
        {/* Social Icons */}
        <div className="flex items-center space-x-4">
          <a
            href="https://facebook.com"
            className="hover:text-blue-300 transition duration-300"
          >
            <FaFacebookF aria-label="Facebook" />
          </a>
          <a
            href="https://twitter.com"
            className="hover:text-blue-300 transition duration-300"
          >
            <FaTwitter aria-label="Twitter" />
          </a>
          <a
            href="https://linkedin.com"
            className="hover:text-blue-300 transition duration-300"
          >
            <FaLinkedinIn aria-label="LinkedIn" />
          </a>
          <a
            href="https://youtube.com"
            className="hover:text-blue-300 transition duration-300"
          >
            <FaYoutube aria-label="YouTube" />
          </a>
        </div>

        {/* Navigation Links */}
        <nav>
          <a
            href="/about"
            className="px-4 py-2 inline-block hover:text-blue-300 transition duration-300"
          >
            Om Oss
          </a>
          <a
            href="/terms"
            className="px-4 py-2 inline-block hover:text-blue-300 transition duration-300"
          >
            Användarvillkor
          </a>
          <a
            href="/terms"
            className="px-4 py-2 inline-block hover:text-blue-300 transition duration-300"
          >
            Bli uthyrare
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
