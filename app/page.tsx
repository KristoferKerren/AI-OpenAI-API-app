"use client";

import { sleep } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import axios from "axios";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import {
  Messages,
  ThreadMessage,
} from "openai/resources/beta/threads/messages/messages.mjs";

export default function Home() {
  const [searching, setSearching] = useState(false);
  // const [openAiThreadId, setOpenAiThreadId] = useState("");
  let openAiThreadId: string;

  const terminalStates = ["cancelled", "failed", "completed", "expired"];
  const statusCheckLoop = async (
    openAiThreadId: string,
    runId: string
  ): Promise<string> => {
    const runRes = await axios.get<{ run: Run }>(
      `/api/retrieve-run?threadId=${openAiThreadId}&runId=${runId}`
    );
    console.log(runRes.data.run);

    if (!terminalStates.includes(runRes.data.run.status)) {
      await sleep(1000);
      return statusCheckLoop(openAiThreadId, runId);
    }
    return runRes.data.run.status;
  };

  const handleSearch = async () => {
    setSearching(true);

    try {
      if (!openAiThreadId) {
        const threadRes = await axios.get<{ thread: Thread }>(
          "/api/create-thread/"
        );
        openAiThreadId = threadRes.data.thread.id;
      }

      const runRes = await axios.get<{ run: Run }>(
        `/api/create-run?threadId=${openAiThreadId}`
      );

      await statusCheckLoop(openAiThreadId, runRes.data.run.id);
      setSearching(false);

      const messageRes = await axios.get<{ messages: ThreadMessage[] }>(
        `/api/get-messages?threadId=${openAiThreadId}`
      );

      //const response = messageRes.data.messages.data[0].content[0].text.value;
      // console.log(response);
    } catch {
      setSearching(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-800 text-white p-5">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">HyrOnline</h1>
          <nav>
            <a
              href="/login"
              className="text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Logga in
            </a>
            <a
              href="/register"
              className="text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Registrera dig
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto flex items-center py-12">
          <div>
            <h2 className="text-5xl text-gray-700 font-bold mb-6">
              Vad behöver du hyra?
            </h2>
            <div className="flex w-full max-w-md">
              <input
                type="text"
                placeholder="Ex. grävmaskin eller slagborr"
                className="flex-grow p-4 border border-gray-300 rounded-l-lg"
              />
              <button
                className={`bg-blue-500 text-white px-6 py-4 rounded-r-lg  ${
                  searching
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-700 transition duration-300"
                }`}
                disabled={searching}
                onClick={handleSearch}
              >
                {searching ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
                  </div>
                ) : (
                  "Sök"
                )}
              </button>
            </div>
          </div>
          <div>
            <img src="./HyrOnline.png" alt="Maskiner och verktyg" />
          </div>
        </div>
      </main>

      {/* Footer */}
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
          </nav>
        </div>
      </footer>
    </>
  );
}
