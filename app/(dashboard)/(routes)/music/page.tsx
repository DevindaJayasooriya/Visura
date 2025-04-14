import { Heading } from "@/components/heading";
import { MessageSquare, Music } from "lucide-react";

const MusicPage = ()=>{
    return (
        <div>
            <Heading
                    title="Music Generation"
                    description="Generate your own musics with Visura Music Generation"
                    icon={Music}
                    iconColor="text-pink-500"
                    bgColor="bg-pink-500/10"
                  />
        </div>
    );
}

export default MusicPage;