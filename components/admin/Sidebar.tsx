"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
// import { cn, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  // console.log("pathname.....................", pathname)

  return (
    <div className="admin-sidebar"> {/* Note: No width specify for this sidebar the content determine the width so it can adjust when content collapse to only icons */}
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1>Bookish</h1>{/* to know how this text is hidden in small screen check ".admin-sidebar .logo h1 {" in global.css */}
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            
            const isSelected =
              (link.route !== "/admin" && pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div className={cn("link", isSelected && "bg-primary-admin shadow-sm")}>
                  
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${isSelected ? "brightness-0 invert" : ""}  object-contain`} //This is a CSS feature: brightness-0 → makes the element completely black (brightness set to 0%) AND invert → inverts the colors (black ↔ white, etc.). Make sure they are inside "{}".
                    />
                  </div>

                  <p className={cn(isSelected ? "text-white" : "text-dark")}>
                    {link.text} {/* to know how this text is hidden in small screen check ".admin-sidebar .link p {" in global.css */}
                  </p>

                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="user">
        {/* <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar> */}

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p>
          <p className="text-xs text-light-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;