"use client"


import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

const ConversationPage = () => {   
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), 
    defaultValues:{
        prompt: ""
    }
})

const isLoading = form.formState.isSubmitting;

const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
}  
    
     return(
        <div> 
        <Heading
            title="Conversation"
            description="Manage your conversations with our advanced Visura conversation model."
            icon={MessageSquare}
            iconColor="text-violet-500"
            bgColor="bg-violet-500/10"
        />
        <div className="px-4 lg:px-8">
            <div>
                <Form></>
            </div>
        </div>
        </div>
    );
}

export default ConversationPage; 