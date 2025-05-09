"use client";

import OpenAI from "openai";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { User, Bot, Copy, RefreshCw, Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avarat";
import { BotAvatar } from "@/components/bot-avatar";
import { toast } from "react-hot-toast"; 
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";


type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  className?: string;
  children?: React.ReactNode;
};

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  const regenerateResponse = async () => {
    if (messages.length < 2) return;
    
    setIsRegenerating(true);
    setError(null);
    
    try {
      // Remove the last assistant message
      const newMessages = messages.slice(0, -1);
      
      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      // Replace the last message with the new response
      setMessages([...newMessages, response.data]);
    } catch (error: any) {
      console.log("[REGENERATE_ERROR]", error);
      setError("Failed to regenerate response. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

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
          errorMessage =
            "Our AI service is currently unavailable. Please try again later :)";
        }
      }
      setError(errorMessage);
    } finally {
      router.refresh();
    }
  };

  const renderMessageContent = (message: ChatMessage) => {
    const content = typeof message.content === "string" 
      ? message.content 
      : Array.isArray(message.content) 
        ? message.content.map(part => 
            typeof part === "string" ? part : part.type === "text" ? part.text : ""
          ).join("\n") 
        : JSON.stringify(message.content);
  
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          children={content}
          components={{
            code({ className, children }) {
              // Regular inline code
              if (!className) {
                return <code>{children}</code>;
              }
              
              // Code block with language
              const language = className.replace('language-', '');
              return (
                <Prism
                  children={String(children).replace(/\n$/, '')}
                  language={language}
                  style={atomDark as any}
                />
              );
            }
          }}
        />
      </div>
    );
  };
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate your own solution with Visura Code Generation"
        icon={Code}
        iconColor="text-teal-700"
        bgColor="bg-teal-700/10"
      />

      <div className="px-4 lg:px-8">
        {/* Message display area - with fixed height and scrolling */}
        <div className="mt-4 mb-24">
          <div className="h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 font-medium text-xl">
                Start generation by providing a prompt...
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-6 w-full flex flex-col rounded-lg",
                      message.role === "user"
                        ? "bg-violet-500/10 ml-auto max-w-md"
                        : "bg-gray-100 mr-auto max-w-md"
                    )}
                  >
                    <div className="flex items-center mb-2">
                      {message.role === "user" ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar />
                          <span className="text-sm font-medium">You</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <BotAvatar />
                          <span className="text-sm font-medium">Visura AI</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      {renderMessageContent(message)}
                    </div>
                    
                    {/* Add buttons for assistant messages */}
                    {message.role === "assistant" && (
                      <div className="flex justify-end gap-2 mt-2">
                        <Button 
                          onClick={() => copyToClipboard(typeof message.content === "string" 
                            ? message.content 
                            : JSON.stringify(message.content))}
                          size="sm" 
                          variant="ghost" 
                          className="p-1 h-8"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="ml-1 text-xs">Copy</span>
                        </Button>
                        
                        {index === messages.length - 1 && message.role === "assistant" && (
                          <Button 
                            onClick={regenerateResponse}
                            size="sm" 
                            variant="ghost" 
                            className="p-1 h-8"
                            disabled={isRegenerating}
                          >
                            <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
                            <span className="ml-1 text-xs">
                              {isRegenerating ? "Regenerating..." : "Regenerate"}
                            </span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
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
                  <FormItem className="flex-1 bg-transparent md:col-span-10">
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
                        disabled={isLoading || isRegenerating}
                        placeholder="What do you want to generate today?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem> 
                )}
              />
              <Button
                className="w-full md:col-span-2 bg-teal-500 hover:bg-teal-600 text-sm md:text-base py-2 mt-2 md:mt-0"
                disabled={isLoading || isRegenerating}
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

export default CodePage;