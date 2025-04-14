import { Heading } from "@/components/heading";
import { Code, MessageSquare } from "lucide-react";

const CodePage = ()=>{
    return (
        <div>
        <Heading
        title="Code Generation"
        description="Code your solution with Visura Code Generation"
        icon={Code}
        iconColor="text-teal-500"
        bgColor="bg-teal-500/10"
      />
        </div>
    );
}

export default CodePage;