async function handler({ content, format = "html", options = {} }) {
  if (!content) {
    return {
      error: "Content is required",
    };
  }

  if (!["html", "markdown"].includes(format)) {
    return {
      error: 'Format must be either "html" or "markdown"',
    };
  }

  try {
    const defaultOptions = {
      format: "A4",
      margin: {
        top: "40px",
        right: "40px",
        bottom: "40px",
        left: "40px",
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const response = await fetch("https://api.create.xyz/v1/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        format,
        options: mergedOptions,
      }),
    });

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    const pdfBuffer = await response.arrayBuffer();

    return {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="generated.pdf"',
      },
      body: Buffer.from(pdfBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      error: "Failed to generate PDF",
    };
  }
}
