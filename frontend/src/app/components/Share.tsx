import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import React from "react";
import { RWebShare } from "react-web-share";
interface RWebShareProps {
  url: string;
  title: string;
  text: string;
}
const ShareButton: React.FC<RWebShareProps> = ({ url, title, text }) => {
  return (
    <RWebShare
      data={{
        text,
        url,
        title,
      }}
      onClick={() => console.log("ss")}
    >
      <Button size={"sm"} variant={"outline"}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </RWebShare>
  );
};

export default ShareButton;
