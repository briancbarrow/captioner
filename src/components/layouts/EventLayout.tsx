import {
  ArrowDownOnSquareIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpOnSquareIcon,
  BeakerIcon,
  BoltIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Onboarding from "@/components/Onboarding";
import classNames from "@/util/classNames";

import type { Navigation, NavigationPage } from "@/types/navigation";
import MainNav from "../MainNav";
import EventHeader from "../EventHeader";

type EventLayout = {
  children: React.ReactNode;
};

// const recents = [
//   { id: 1, name: "Planetaria", href: "#", initial: "P", current: false },
//   { id: 2, name: "Protocol", href: "#", initial: "P", current: false },
//   { id: 3, name: "Tailwind Labs", href: "#", initial: "T", current: false },
// ];

const EventLayout = ({ children }: EventLayout) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <EventHeader />
      <div className="w-full h-full bg-black">
        <div>
          <main className="p-8 max-w-none prose dark:prose-invert">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventLayout;