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
  eventName: string;
  type?: "broadcast" | "viewer";
};

const EventLayout = ({ eventName, type, children }: EventLayout) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <EventHeader
        eventName={type === "broadcast" ? eventName + " Broadcast" : eventName}
      />
      <div className="w-full h-full bg-black">
        <div>
          <main className="px-8 pt-3 h-[80vh] max-w-none">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default EventLayout;
