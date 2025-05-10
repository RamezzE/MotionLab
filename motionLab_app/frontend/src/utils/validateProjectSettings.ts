interface ProjectSettingsForm {
    projectName: string;
    xSensitivity: number;
    ySensitivity: number;
    stationary: boolean;
}

interface ValidationResult {
    success: boolean;
    error: string | null;
}

export const validateProjectSettings = (
    formData: ProjectSettingsForm
): ValidationResult => {
    let { projectName } = formData;

    const response: ValidationResult = {
        success: true,
        error: null,
    };

    projectName = projectName.trim();

    if (!projectName) {
        response.success = false;
        response.error = "Project Name is required";
    }

    return response;
};
