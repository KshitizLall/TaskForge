"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { trashAPI } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

interface TrashPageProps {
  onBack: () => void;
}

export function TrashPage({ onBack }: TrashPageProps) {
  const [trashData, setTrashData] = useState<{
    total: number;
    projects: number;
    tasks: number;
    items: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTrashData();
  }, []);

  const loadTrashData = async () => {
    try {
      setLoading(true);
      const data = await trashAPI.getAllItems();
      setTrashData(data);
    } catch (error) {
      console.error("Failed to load trash data:", error);
      toast({
        title: "Error",
        description: "Failed to load deleted items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (
    itemType: "project" | "task",
    itemId: string
  ) => {
    try {
      await trashAPI.restoreItem(itemType, itemId);
      toast({
        title: "Success",
        description: `${
          itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } restored successfully`,
      });
      await loadTrashData(); // Refresh the data
    } catch (error) {
      console.error("Failed to restore item:", error);
      toast({
        title: "Error",
        description: `Failed to restore ${itemType}`,
        variant: "destructive",
      });
    }
  };

  const handlePermanentDelete = async (
    itemType: "project" | "task",
    itemId: string
  ) => {
    try {
      await trashAPI.permanentDeleteItem(itemType, itemId);
      toast({
        title: "Success",
        description: `${
          itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } permanently deleted`,
      });
      await loadTrashData(); // Refresh the data
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({
        title: "Error",
        description: `Failed to permanently delete ${itemType}`,
        variant: "destructive",
      });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await trashAPI.emptyTrash();
      toast({
        title: "Success",
        description: "Trash emptied successfully",
      });
      await loadTrashData(); // Refresh the data
    } catch (error) {
      console.error("Failed to empty trash:", error);
      toast({
        title: "Error",
        description: "Failed to empty trash",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Page Title */}
      <div className="flex items-center space-x-3">
        <Trash2 className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trash
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Recover deleted items or remove them permanently
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trashData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Items in trash</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trashData?.projects || 0}</div>
            <p className="text-xs text-muted-foreground">Deleted projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trashData?.tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Deleted tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={!trashData?.total}>
              <Trash2 className="h-4 w-4 mr-2" />
              Empty Trash
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Empty Trash</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all items in the trash. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEmptyTrash}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Empty Trash
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Deleted Items */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : !trashData?.items?.length ? (
        <EmptyState
          icon={<Trash2 className="h-12 w-12 text-muted-foreground" />}
          title="Trash is empty"
          description="No deleted items found. Deleted projects and tasks will appear here."
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Deleted Items</h3>
          <div className="space-y-3">
            {trashData.items.map((item: any) => (
              <Card key={`${item.type}-${item.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">
                          {item.type === "project" ? item.name : item.title}
                        </h4>
                        <Badge variant="secondary">{item.type}</Badge>
                        {item.priority && (
                          <Badge
                            variant={
                              item.priority === "high"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {item.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Deleted: {new Date(item.deletedAt).toLocaleDateString()}{" "}
                        at {new Date(item.deletedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item.type, item.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Forever
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Forever</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "
                              {item.type === "project" ? item.name : item.title}
                              ". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handlePermanentDelete(item.type, item.id)
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Forever
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
