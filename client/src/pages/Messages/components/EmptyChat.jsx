import { Message01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

const EmptyChat = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <HugeiconsIcon
        icon={Message01Icon}
        className="w-16 h-16 text-primary-silver opacity-20"
      />
      <p className="text-primary-silver opacity-40 text-center text-sm">
        Select a conversation to start messaging
      </p>
    </div>
  );
};

export default EmptyChat;
