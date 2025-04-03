"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideMessageSquareShare,CircleArrowRight,Images,Clapperboard,Music,Code } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    lable: "conversation",
    icon: LucideMessageSquareShare,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/conversation",
  },
  {
    lable: "Image Generation",
    icon: Images,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/image",
  },
  {
    lable: "Video Generation",
    icon:Clapperboard,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
    href: "/video",
  },
  {
    lable: "Music Generation",
    icon:Music,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/music",
  },
  {
    lable: "Code Generation",
    icon:Code,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    href: "/code",
  },
];

const DashboardPage = () => {
const router = useRouter();
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of Visura
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the Visura AI - Explore the power of Visura
        </p>
      </div>

      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
          onClick={() => router.push(tool.href)}
          key={tool.href}
          className="p-4 border-black/5 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)}/>
              </div>
              <div className="font-semibold">
                {tool.lable}
              </div>
            </div>
            <CircleArrowRight className="w-6 h-6"/>
          </div>
        </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
