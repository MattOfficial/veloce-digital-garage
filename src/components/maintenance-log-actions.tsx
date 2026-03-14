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
import { ui } from "@/content/en/ui";

interface MaintenanceLogActionsProps {
    log: MaintenanceLog;
    vehicleId: string;
}

export function MaintenanceLogActions({ log, vehicleId }: MaintenanceLogActionsProps) {
    const { fetchVehicles } = useVehicleStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(ui.maintenance.maintenanceActions.confirmDelete)) return;

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
                        <span className="sr-only">{ui.common.navigation.openMenuSrOnly}</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="cursor-pointer rounded-lg">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>{ui.maintenance.maintenanceActions.editRecord}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{isDeleting ? ui.maintenance.maintenanceActions.deleting : ui.maintenance.maintenanceActions.deleteRecord}</span>
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
