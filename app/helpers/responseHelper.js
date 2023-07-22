exports.success = (
    response,
    message = "Success",
    payload = null,
    code = 200
) => {
    if (!response) {
        return process.exit(0);
    }
    return response.status(code).json({
        success: true,
        message: message,
        data: payload || null,
    });
};

exports.failure = (response, error, code = 400, payload) => {
    if (!response || !error) {
        return process.exit(0);
    }

    // Invalid token - Unauthorized Error
    if (error.name === "UnauthorizedError") {
        return response.status(code).json({
            success: false,
            errorCode: error.name,
            message: "Unauthorized request",
        });
    }

    // Invalid token - Unauthorized Error
    if (error.name === "CastError") {
        return response.status(code).json({
            success: false,
            errorCode: error.name,
            message: "Invalid reference id",
        });
    }

    // MongoDB validation error
    if (error.name === "ValidationError") {
        const errors = [];
        Object.keys(error.errors).forEach((key) => {
            errors.push({
                key,
                message: error.errors[key].message
                    .replaceAll("Path", "")
                    .replaceAll("path", "")
                    .replaceAll("`", "")
                    .trim(),
            });
        });
        return response.status(code).json({
            success: false,
            message: "Validation failed",
            errorCode: error.name,
            errors,
        });
    }

    return response.status(error.message ? code : 500).json({
        success: false,
        errorCode: "Custom",
        message: error.message || "Internal server error",
        payload,
    });
};
