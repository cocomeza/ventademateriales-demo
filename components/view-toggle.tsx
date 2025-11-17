"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useViewStore } from "@/store/view-store";

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewStore();

  return (
    <div className="flex items-center gap-1 border border-primary/20 rounded-md p-1 bg-background">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className="h-8 px-3"
        aria-label="Vista de cuadrícula"
        aria-pressed={viewMode === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("list")}
        className="h-8 px-3"
        aria-label="Vista de lista"
        aria-pressed={viewMode === "list"}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

