import React, { useRef, useState } from "react";
import { Trash2 } from "lucide-react";

const DeleteAccount = ({ onDeleteAccount }) => {
    const [confirmationStep, setConfirmationStep] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const dialogRef = useRef(null);

    const confirmationTexts = [
        {
            title: "Are you sure?",
            description: "This action will permanently delete your account and all associated data. This cannot be undone.",
        },
        {
            title: "Second Confirmation Required",
            description: "Please confirm again that you want to delete your account. All your favorites, cart items, and personal information will be permanently removed.",
        },
        {
            title: "Final Warning",
            description: "This is your final confirmation. By clicking 'Delete Account', you acknowledge that this action is permanent and irreversible.",
        },
    ];

    const handleConfirm = () => {
        if (confirmationStep < 2) {
            setConfirmationStep(confirmationStep + 1);
        } else {
            setIsDeleting(true);
            onDeleteAccount();
            dialogRef.current.close();
        }
    };

    const handleCancel = () => {
        setConfirmationStep(0);
        dialogRef.current.close();
    };

    const openDialog = () => {
        setConfirmationStep(0);
        dialogRef.current.showModal();
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={openDialog}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
                <Trash2 className="w-5 h-5" /> Delete Account
            </button>

            {/* Modal */}
            <dialog
                ref={dialogRef}
                className="backdrop:bg-black/50 p-6 bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full shadow-lg"
                onCancel={handleCancel}
            >
                <h2 className="text-lg font-semibold text-red-500">
                    {confirmationTexts[confirmationStep].title}
                </h2>
                <p className="text-gray-300 mt-2">
                    {confirmationTexts[confirmationStep].description}
                </p>

                {/* Buttons */}
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : confirmationStep === 2 ? "Delete Account" : "Continue"}
                    </button>
                </div>
            </dialog>
        </>
    );
};

export default DeleteAccount;
