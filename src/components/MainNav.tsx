import Link from "next/link";
import MiniProfile from "@/components/MiniProfile";
import classNames from "@/util/classNames";

import type { Navigation, NavigationPage } from "@/types/navigation";

const NavItem = ({ item }: { item: NavigationPage }) => {
  return (
    <li>
      <Link
        href={item.href}
        className={classNames(
          item.current
            ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white"
            : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-700",
          "group flex gap-x-3 rounded-md p-px"
        )}
      >
        <span
          className={classNames(
            item.current
              ? "bg-zinc-900"
              : "bg-transparent group-hover:bg-zinc-900",
            "flex flex-grow p-2 rounded-md text-sm leading-6 font-semibold"
          )}
        >
          <item.icon className="h-6 w-6 shrink-0 mr-2" aria-hidden="true" />
          {item.name}
        </span>
      </Link>
    </li>
  );
};

const MainNav = ({
  navigation,
  recents,
}: {
  navigation: Navigation;
  recents: any[];
}) => {
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item, i) => (
              <NavItem key={i} item={item}></NavItem>
            ))}
          </ul>
        </li>
        {/* <li>
          <div className="text-xs font-semibold leading-6 text-zinc-400 uppercase">
            Recent transcripts
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
                  <span className="truncate">{recent.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </li> */}
        <li className="-mx-6 mt-auto">
          <MiniProfile />
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
