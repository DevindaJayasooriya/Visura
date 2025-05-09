import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserAvatar = () => {
     const { user } = useUser(); 

     return(
        <Avatar className="w-8 h-8">
            <AvatarImage src="{user?.userProfileImageUrl}" alt="User Avatar" />
            <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>

     )
}