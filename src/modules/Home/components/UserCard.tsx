import { User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GithubUserDetail } from "../DAO/user.dao";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  user: GithubUserDetail;
  onClick: () => void;
  isSelected: boolean;
}

export function UserCard(props: UserCardProps) {
  const { user, onClick, isSelected } = props;

  const initialName = user.login.charAt(0).toUpperCase();

  return (
    <Card
      className={`cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full ${
        isSelected
          ? "border-purple-500 bg-purple-950/30"
          : "border-gray-800 bg-gray-900/60 hover:bg-gray-900/80"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4">
          <Avatar className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-purple-500/50 flex-shrink-0">
            <AvatarImage
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.login}
            />
            <AvatarFallback>{initialName}</AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-lg truncate text-white">
              {user.name ?? user.login}
            </h3>
            <p className="text-purple-300 text-sm">@{user.login}</p>

            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="bg-gray-800/50 text-gray-300">
                <Users className="h-3 w-3 mr-1" />
                {user.followers}
              </Badge>
              <Badge variant="outline" className="bg-gray-800/50 text-gray-300">
                <User className="h-3 w-3 mr-1" />
                {user.public_repos} repos
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 flex-grow">
          {user.bio ? (
            <p className="text-sm text-gray-300 line-clamp-2">{user.bio}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No bio available</p>
          )}
        </div>

        {isSelected && (
          <div className="mt-2 h-1 w-full bg-purple-500 rounded-full"></div>
        )}
      </CardContent>
    </Card>
  );
}
