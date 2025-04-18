 import { Label } from "@radix-ui/react-label";
import * as z from "zod";

 export const formSchema = z.object({
   prompt: z.string().min(1, {
     message: "Image Prompt is required",
   }), 
   amount : z.string().min(1),
   resolution: z.string().min(1)
 }) 

 export const amountOptions =[
  {
    value:"1",
    label:"1 Photo",
  },
  {
    value:"2",
    label:"2 Photo",
  },
  {
    value:"3",
    label:"3 Photo",
  },
  {
    value:"4",
    label:"4 Photo",
  },
  {
    value:"5",
    label:"5 Photo",
  }, 
 ]

 export const resolutionOptions = [
  {
    value:"256x256",
    lable:"256x256",
  },
  {
    value:"512x512",
    lable:"512x512",
  },
  {
    value:"1024x1024",
    lable:"1024x1024",
  }
 ]