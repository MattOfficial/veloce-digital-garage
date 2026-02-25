"use client";

import { useState } from "react";
import { MaintenanceLog } from "@/types/database";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMaintenanceModal } from "@/components/add-maintenance-modal";
import { deleteMaintenanceLog } from "@/app/actions/maintenance";
import { useVehicleStore } from "@/store/vehicle-store";

interface MaintenanceLogActionsProps {
    log: MaintenanceLog;
    vehicleId: string;
}

export function MaintenanceLogActions({ log, vehicleId }: MaintenanceLogActionsProps) {
    const { fetchVehicles } = useVehicleStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this maintenance record?")) return;

        setIsDeleting(true);
        const result = await deleteMaintenanceLog(log.id, vehicleId);
        if (result.error) {
            alert(result.error);
        } else {
            fetchVehicles();
        }
        setIsDeleting(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="cursor-pointer rounded-lg">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Record</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{isDeleting ? "Deleting..." : "Delete Record"}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {isEditModalOpen && (
                <AddMaintenanceModal
                    vehicleId={vehicleId}
                    logToEdit={log}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    trigger={<span className="hidden" />}
                />
            )}
        </>
    );
}
