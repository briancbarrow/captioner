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

type AppLayout = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayout) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const home: NavigationPage = {
    name: "Dashboard",
    href: "/app",
    icon: HomeIcon,
    current: router.route === "/app",
  };

  const navigation: Navigation = [home];

  const breadcrumbs = (): Navigation => {
    let crumbs: Navigation = [home];

    if (router.route !== home.href) {
      const match = navigation.find(
        (page) => page.href !== home.href && router.route.startsWith(page.href)
      );

      if (match) crumbs.push(match);
    }

    return crumbs;
  };

  const current = (): NavigationPage => {
    let current = home;

    if (router.route !== home.href) {
      const match = navigation.find(
        (page) => page.href !== home.href && router.route.startsWith(page.href)
      );

      if (match) {
        current = match;
      }
    }

    return current;
  };

  return (
    <div className="w-full h-full bg-black">
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-zinc-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <h1 className="flex gap-x-3 text-2xl leading-8 font-bold">
                        <BeakerIcon className="h-8 w-8 stroke-red-500" />
                        Deepbin
                      </h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-zinc-800 text-white"
                                      : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        {/* <li>
                          <div className="text-xs font-semibold leading-6 text-zinc-400">
                            Your teams
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {recents.map((recent) => (
                              <li key={recent.name}>
                                <a
                                  href={recent.href}
                                  className={classNames(
                                    recent.current
                                      ? "bg-zinc-800 text-white"
                                      : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[0.625rem] font-medium text-zinc-400 group-hover:text-white">
                                    {recent.initial}
                                  </span>
                                  <span className="truncate">
                                    {recent.name}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li> */}
                        <li className="-mx-6 mt-auto">
                          <a
                            href="#"
                            className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-zinc-800"
                          >
                            <img
                              className="h-8 w-8 rounded-full bg-zinc-800"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                            <span className="sr-only">Your profile</span>
                            <span aria-hidden="true">Tom Cook</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-72 xl:flex-col bg-zinc-900 border-r border-r-zinc-800">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="flex gap-x-3 text-2xl leading-8 font-bold">
                <BeakerIcon className="h-8 w-8 stroke-red-500" />
                Deepbin
              </h1>
            </div>

            <MainNav navigation={navigation} />
          </div>
        </div>

        <div className="xl:pl-72">
          <div className="xl:hidden border-b border-b-zinc-700  bg-zinc-900 h-16 p-4">
            <h1 className="ml-14 flex gap-x-3 text-2xl leading-8 font-bold">
              <BeakerIcon className="h-8 w-8 stroke-red-500" />
              Deepbin
            </h1>
          </div>

          <BreadcrumbNav pages={breadcrumbs()} home={home} />

          {/* <Onboarding /> */}

          <main className="p-8 max-w-none prose dark:prose-invert">
            <h1>{current().name}</h1>
            {children}
          </main>

          <div className="xl:hidden absolute left-5 top-0 w-16 justify-center pt-5">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
