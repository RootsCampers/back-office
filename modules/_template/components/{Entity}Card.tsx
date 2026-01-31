"use client";

// Type imports from own module
import type { {Entity} } from "../domain/types";

// Implementation imports from own module
import { {ENTITY}_STAGE_CONFIG } from "../domain/types";

// Shared library imports
import { cn } from "@/lib/utils";

// UI component imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface {Entity}CardProps {
  {entity}: {Entity};
  isDragging?: boolean;
}

export function {Entity}Card({ {entity}, isDragging }: {Entity}CardProps) {
  const stageConfig = {ENTITY}_STAGE_CONFIG[{entity}.stage];

  return (
    <Card
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 rotate-2 shadow-lg"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">{{entity}.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn(stageConfig.color, stageConfig.bgColor)}
          >
            {stageConfig.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date({entity}.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
