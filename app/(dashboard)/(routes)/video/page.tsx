import { Heading } from "@/components/heading";
import { Clapperboard, MessageSquare } from "lucide-react";

const VideoPage = ()=>{
    return (
        <div>
            <Heading
                    title="Video Generation"
                    description="Generate your own clips with Visura Video Generation"
                    icon={Clapperboard}
                    iconColor="text-fuchsia-500"
                    bgColor="bg-fuchsia-500/10"
                  />
        </div>
    );
}

export default VideoPage;