"use client";

import ChatContainer from "./components/ChatContainer";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header></Header>

      <main className="flex-grow">
        <div className="container mx-auto flex items-center py-12">
          <div className="max-w-4xl">
            <ChatContainer></ChatContainer>
          </div>
          <div>
            <img src="./HyrOnline.png" alt="Maskiner och verktyg" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer></Footer>
    </>
  );
}
