export default function responseMiddleware(req, res, next) {
    res.success = (message = "", body = null, status = 200) => {
        res.status(status).json({
            success: true,
            body,
            message,
            status,
        });
    };

    res.fail = (message = "", status = 400, body = null) => {
        res.status(status).json({
            success: false,
            body,
            message,
            status,
        });
    };
    next();
}
