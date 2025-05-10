import React from 'react';
import { Avatar } from '@readyplayerme/visage';
import FormButton from '@/components/UI/FormButton';

interface RetargetPreviewModalProps {
    modelSrc: string;
    characterName: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

const RetargetPreviewModal: React.FC<RetargetPreviewModalProps> = ({
    modelSrc,
    characterName,
    onConfirm,
    onCancel,
    loading,
}) => {
    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/75">
            <div className="bg-gray-800 p-6 rounded-lg w-full sm:w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="mb-4 text-white text-xl">Preview Selected Avatar</h2>
                
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="mb-2 text-white">{characterName}</h3>
                        <div className="w-full h-[300px]">
                            <Avatar
                                modelSrc={modelSrc}
                                shadows={true}
                                // cameraZoomTarget={new Vector3(0, 0.1, 0)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <FormButton
                            label="Cancel"
                            onClick={onCancel}
                            theme="transparent"
                            fullWidth={false}
                            textSize="base"
                            disabled={loading}
                        />
                        <FormButton
                            label={loading ? "Retargeting..." : "Confirm Retargeting"}
                            onClick={onConfirm}
                            loading={loading}
                            theme="default"
                            fullWidth={false}
                            textSize="base"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetargetPreviewModal; 