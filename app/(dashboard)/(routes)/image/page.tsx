import { Heading } from "@/components/heading";
import { Images, MessageSquare } from "lucide-react";

const ImagePage = ()=>{
    return (
        <div>
            <Heading
                    title="Image Generation"
                    description="Generate your own images with Visura Image Generation"
                    icon={Images}
                    iconColor="text-cyan-500"
                    bgColor="bg-cyan-500/10"
                  />
        </div>
    );
}

export default ImagePage;