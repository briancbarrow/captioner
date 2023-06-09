import "@/styles/globals.css";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { Inter } from "next/font/google";
import { createContext, useContext, useState } from "react";

import type { AppProps } from "next/app";

const inter = Inter({ subsets: ["latin"] });

type LanguageContext = {
  language: string;
  setLanguage: (index: string) => void;
};

const LanguageContext = createContext({} as LanguageContext);

export function useLanguageContext() {
  return useContext(LanguageContext);
}

const Deepbin = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) => {
  const [language, setLanguage] = useState("");
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <Component {...pageProps} />
      </LanguageContext.Provider>
    </SessionContextProvider>
  );
};

export default Deepbin;
