import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InventorySlotProps {
  item?: {
    icon: string;
    name: string;
  };
  index?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function InventorySlot({ item, index = 0, selected = false, onClick }: InventorySlotProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative h-14 w-14 rounded-sm border transition-all duration-200",
        "flex flex-col items-center justify-center gap-0.5",
        item
          ? selected
            ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(224,153,30,0.2)]"
            : "border-border/60 bg-secondary/30 hover:border-primary/40"
          : "border-dashed border-border/30 bg-transparent"
      )}
      data-testid={`inventory-slot-${index}`}
      title={item?.name}
    >
      {item ? (
        <>
          <span className="text-xl leading-none">{item.icon}</span>
          <span className="text-[8px] text-muted-foreground truncate w-full text-center px-0.5 leading-none">
            {item.name}
          </span>
        </>
      ) : (
        <div className="h-3 w-3 rounded-full border border-border/20" />
      )}
    </motion.button>
  );
}
