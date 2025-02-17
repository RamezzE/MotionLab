export const validateProjectSettings = (formData) => {
    
    let { projectName, outputFormat, peopleCount } = formData;

    const response = {
        success: true,
        error: null
    };

    projectName = projectName.trim();
    outputFormat = outputFormat.trim();
    peopleCount = peopleCount.trim();

    if (!projectName) {
        response.success = false;
        response.error = "Project Name is required";
    }
    else if (!outputFormat) {
        response.success = false;
        response.error = "Output Format is required";
    }

    else if (!peopleCount) {
        response.success = false;
        response.error = "Number of People is required";
    }

    // Check if project name already exists in backend using api call

    return response;
};