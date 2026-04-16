import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import React from "react";

interface ShareButtonProps {
  url: string;
  title: string;
  text: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, title, text }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        // fallback (copy to clipboard)
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
};

export default ShareButton;