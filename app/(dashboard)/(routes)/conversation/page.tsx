"use client";

import OpenAI from "openai";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare, User, Bot } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      const userMessage: ChatMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      setMessages((current) => [...current, userMessage]);

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      // Add the assistant's response to messages
      setMessages((current) => [...current, response.data]);

      form.reset();
    } catch (error: any) {
      console.log("[CONVERSATION_ERROR]", error);
      

      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          errorMessage = "Our AI service is currently unavailable. Please try again later :)";
      }}
      setError(errorMessage);
    }
    finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Manage your conversations with our advanced Visura conversation model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <div className="px-4 lg:px-8">
        {/* Message display area */}
        <div className="space-y-4 mt-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh] text-gray-500 font-medium text-xl">
              Start a conversation by asking a questions..
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg",
                    message.role === "user"
                      ? "bg-violet-500/10 ml-auto max-w-md"
                      : "bg-gray-100 mr-auto max-w-md"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === "user" ? (
                      <>
                        <User className="h-4 w-4 text-violet-500" />
                        <p className="font-semibold text-violet-500">You</p>
                      </>
                    ) : (
                      <>
                        <Bot className="h-5 w-5 text-gray-700" />
                        <p className="text-xs font-semibold text-gray-700">Visura AI</p>
                      </>
                    )}
                  </div>
                  <div className="text-sm">
                    {typeof message.content === "string"
                      ? message.content
                      : Array.isArray(message.content)
                      ? message.content.map((part, i) =>
                          typeof part === "string" ? (
                            <p key={i}>{part}</p>
                          ) : part.type === "text" ? (
                            <p key={i}>{part.text}</p>
                          ) : (
                            <p key={i}>[Content type not supported]</p>
                          )
                        )
                      : JSON.stringify(message.content)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input form */}
        <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white p-2 md:p-4 z-10">
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="
        rounded-lg
        border
        w-full
        p-2
        md:p-4
        px-3
        md:px-6
        focus-within:shadow-md
        flex
        flex-col
        md:grid
        md:grid-cols-12
        gap-2"
    >
      <FormField
        name="prompt"
        render={({ field }) => (
          <FormItem className="flex-1 md:col-span-10">
            <FormControl className="m-0 p-0">
              <Input
                className="
                  border-none
                  shadow-none
                  outline-none 
                  focus-visible:ring-0
                  focus-visible:ring-transparent
                  text-sm
                  md:text-base"
                disabled={isLoading}
                placeholder="What do you need to know today?"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        className="w-full md:col-span-2 bg-violet-500 hover:bg-violet-600 text-sm md:text-base py-2 mt-2 md:mt-0"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Thinking..." : "Ask Now"}
      </Button>
    </form>
  </Form>
  {error && (
    <div className="mt-2 text-red-500 font-medium text-xs md:text-sm text-center">
      {error}
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default ConversationPage;
