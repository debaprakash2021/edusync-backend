// utils/response.js
export class ApiResponse {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static created(res, data, message = "Created successfully") {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  static paginated(res, data, meta, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta
    });
  }
}