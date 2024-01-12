import { sleep } from "@/lib/utils";
import axios from "axios";
import { useAtom } from "jotai";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ChatContainer() {
  // State
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  let threadId: string =
    typeof window !== "undefined" ? localStorage.getItem("threadId") || "" : "";

  const statusCheck = async (tId: string, rId: string): Promise<string> => {
    const runRes = await axios.get<{ run: Run }>(
      `/api/retrieve-run?threadId=${tId}&runId=${rId}`
    );
    console.log(`Status is ${runRes.data.run.status}`);

    const terminalStates = ["cancelled", "failed", "completed", "expired"];
    if (!terminalStates.includes(runRes.data.run.status)) {
      await sleep(1000);
      return statusCheck(tId, rId);
    }
    return runRes.data.run.status;
  };

  const fetchMessages = async () => {
    setLoading(true);

    try {
      const messageRes = await axios.get<{ messages: ThreadMessage[] }>(
        `/api/get-messages?threadId=${threadId}`
      );

      let newMessages = messageRes.data.messages;

      // Sort messages in descending order by createdAt
      newMessages = newMessages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      console.log({ newMessages });
      setMessages(newMessages);
    } catch (error) {
      console.log("error", error);
      toast.error("Något gick fel", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!threadId) {
        const threadRes = await axios.get<{ thread: Thread }>(
          "/api/create-thread/"
        );
        threadId = threadRes.data.thread.id;
        localStorage.setItem("threadId", threadId);
      }

      const messRes = await axios.post<{ message: ThreadMessage }>(
        `/api/create-message`,
        { message: message, threadId: threadId }
      );

      const runRes = await axios.get<{ run: Run }>(
        `/api/create-run?threadId=${threadId}`
      );
      let runId = runRes.data.run.id;
      await statusCheck(threadId, runId);

      const newMessage = messRes.data.message;
      setMessages([...messages, newMessage]);
      setMessage("");

      toast.success("Meddelande skickat", {
        position: "bottom-center",
      });
      fetchMessages();
    } catch (error) {
      console.log("error", error);
      toast.error("Error sending message", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    localStorage.removeItem("threadId");
    threadId = "";
    setMessages([]);
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full h-full max-h-screen p-10">
      <h2 className="text-5xl text-gray-700 font-bold mb-6">
        Vad behöver du hyra?
      </h2>
      {/* Messages */}
      {messages?.length > 0 && (
        <div className="relative flex flex-col h-full max-h-[calc(100vh-400px)] overflow-y-auto border-blue-200 border-solid border-2 p-6 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`px-4 py-2 mb-3 rounded-lg text-white w-fit text-lg ${
                message.role === "user"
                  ? " bg-blue-500 ml-auto text-right"
                  : " bg-gray-500"
              }`}
            >
              {message.content[0].type === "text"
                ? message.content[0].text.value
                : null}
            </div>
          ))}
          {/* Clear button */}
          <button className="absolute top-0 right-0 p-1" onClick={clear}>
            <svg
              className="h-4 w-4 text-gray-600 hover:text-gray-800"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex flex-row w-full mt-5">
        <input
          type="text"
          className="flex-grow border-blue-200 border-solid border-2 p-2"
          placeholder="Ex. grävmaskiner, hammarborr"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          disabled={loading || message === ""}
          className={`bg-blue-500 text-white px-6 py-4 rounded-r-lg  ${
            loading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-blue-700 transition duration-300"
          }`}
          onClick={sendMessage}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            "Hitta"
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatContainer;
