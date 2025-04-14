import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";

const SettingsPage = ()=>{
    return (
        <div>
            <Heading
                    title="Conversation"
                    description="Manage your conversations with our advanced Visura conversation model"
                    icon={MessageSquare}
                    iconColor="text-violet-500"
                    bgColor="bg-violet-500/10"
                  />
        </div>
    );
}

export default SettingsPage;