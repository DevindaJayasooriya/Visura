"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LucideMessageSquareShare , Images, Clapperboard, Music, Code, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const montserrat = Montserrat ({ weight:"600", subsets: ['latin'] });

const routes =[
  {
  lable: "Dashboard",
  icon:LayoutDashboard,
  href: "/dashboard",
  color:"text-sky-700"
  },
  {
  lable: "Conversion",
  icon:LucideMessageSquareShare,
  href: "/conversion",
  color:"text-violet-700"
  },
  {
  lable: "Image Generation",
  icon:Images,
  href: "/image",
  color:"text-cyan-700"
  },
  {
  lable: "Video Generation",
  icon:Clapperboard,
  href: "/video",
  color:"text-fuchsia-800"
  },
  {
  lable: "Music Generation",
  icon:Music,
  href: "/music",
  color:"text-pink-700"
  },
  {
  lable: "Code Generation",
  icon:Code,
  href: "/code",
  color:"text-teal-700"
  },
  {
  lable: "Settings",
  icon:Settings,
  href: "/settings",
  color:"text-800"
  },
]

const Sidebar = () => {
  const pathnames = usePathname();

  return (
    <div className="space-y-4  flex flex-col h-full bg-[#111827] text-white">
      <div className="py-2 flex">
        <Link href="/dashboard" className="flex items-center pl-3" >
          <div className="relative w-auto h-auto"> 
            <Image
             
            alt="Logo"
            src="/logo.png"
            width={200}
            height={200}
            
            />
            
          </div>
        </Link> 
      </div>

      <div className="space-y-1 px-6 pb-16">
          {routes.map((route)=> (
            <Link
            href={route.href}
            key={route.href}
            className={cn("text-m group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition " , pathnames === route.href ? 'text-white bg-white/10' : 'text-zinc-400')}
            >
            <div className="flex items-center flex-1">
              <route.icon className={cn ("h-5 w-5 mr-3", route.color )}/>
              {route.lable}
            </div>
            </Link>
          ) )}
        </div>
        
    </div>
  );
}

export default Sidebar;