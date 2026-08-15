async function detectHazard() {

    // Get HTML elements
    const imageInput = document.getElementById("imageInput");
    const result = document.getElementById("result");

    const totalHazards = document.getElementById("totalHazards");
    const highRisk = document.getElementById("highRisk");
    const mediumRisk = document.getElementById("mediumRisk");
    const lowRisk = document.getElementById("lowRisk");

    // Reset dashboard
    totalHazards.textContent = "0";
    highRisk.textContent = "0";
    mediumRisk.textContent = "0";
    lowRisk.textContent = "0";

    // Check image
    if (!imageInput || !imageInput.files || imageInput.files.length === 0) {

        result.innerHTML = `
            <div style="color:#d32f2f; font-weight:bold;">
                ❌ Please choose an image first.
            </div>
        `;

        return;
    }

    // Get selected image
    const imageFile = imageInput.files[0];

    // Create form data
    const formData = new FormData();
    formData.append("image", imageFile);

    // Show loading message
    result.innerHTML = `
        <div style="text-align:center;">
            <h3>🔍 Detecting Urban Hazards...</h3>
            <p>Please wait while the AI analyzes the image.</p>
        </div>
    `;

    try {

        // Send image to Flask backend
        const response = await fetch("http://127.0.0.1:5000/detect", {
            method: "POST",
            body: formData
        });

        // Read backend response
        const data = await response.json();

        console.log("Backend response:", data);

        // Check backend error
        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Detection failed on the server."
            );
        }

        /*
         * ----------------------------------------------------
         * GET DETECTIONS
         * ----------------------------------------------------
         *
         * Different backend versions may return:
         *
         * data.detections
         * data.hazards
         * data.results
         *
         * This code supports all three.
         */

        let detections = [];

        if (Array.isArray(data.detections)) {
            detections = data.detections;
        }
        else if (Array.isArray(data.hazards)) {
            detections = data.hazards;
        }
        else if (Array.isArray(data.results)) {
            detections = data.results;
        }

        console.log("Detections:", detections);

        /*
         * ----------------------------------------------------
         * TOTAL HAZARDS
         * ----------------------------------------------------
         */

        const total = detections.length;

        totalHazards.textContent = total;


        /*
         * ----------------------------------------------------
         * RISK CALCULATION
         * ----------------------------------------------------
         *
         * Confidence:
         *
         * 70% or higher  = HIGH
         * 40% - 69%      = MEDIUM
         * Below 40%      = LOW
         */

        let high = 0;
        let medium = 0;
        let low = 0;

        detections.forEach(function (detection) {

            let confidence = detection.confidence;

            // Convert confidence to number
            confidence = Number(confidence);

            // If confidence is between 0 and 1
            if (confidence <= 1) {
                confidence = confidence * 100;
            }

            // Make sure confidence is valid
            if (isNaN(confidence)) {
                confidence = 0;
            }

            console.log(
                "Hazard:",
                detection.class || detection.name || "Unknown",
                "Confidence:",
                confidence + "%"
            );

            // Risk classification
            if (confidence >= 70) {
                high++;
            }
            else if (confidence >= 40) {
                medium++;
            }
            else {
                low++;
            }

        });


        /*
         * ----------------------------------------------------
         * UPDATE DASHBOARD
         * ----------------------------------------------------
         */

        highRisk.textContent = high;
        mediumRisk.textContent = medium;
        lowRisk.textContent = low;


        /*
         * ----------------------------------------------------
         * SHOW DETECTION RESULT
         * ----------------------------------------------------
         */

        let detectionHTML = "";

        if (detections.length > 0) {

            detectionHTML = `
                <div style="
                    margin-top:20px;
                    text-align:left;
                    max-height:400px;
                    overflow-y:auto;
                ">

                    <h3>Detected Hazards</h3>

                    <table style="
                        width:100%;
                        border-collapse:collapse;
                        font-size:14px;
                    ">

                        <thead>
                            <tr>
                                <th style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                ">
                                    #
                                </th>

                                <th style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                ">
                                    Hazard
                                </th>

                                <th style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                ">
                                    Confidence
                                </th>

                                <th style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                ">
                                    Risk
                                </th>
                            </tr>
                        </thead>

                        <tbody>
            `;

            detections.forEach(function (detection, index) {

                let confidence = Number(detection.confidence);

                if (confidence <= 1) {
                    confidence = confidence * 100;
                }

                if (isNaN(confidence)) {
                    confidence = 0;
                }

                let risk = "";
                let riskSymbol = "";

                if (confidence >= 70) {
                    risk = "High";
                    riskSymbol = "🔴";
                }
                else if (confidence >= 40) {
                    risk = "Medium";
                    riskSymbol = "🟠";
                }
                else {
                    risk = "Low";
                    riskSymbol = "🟢";
                }

                const hazardName =
                    detection.class ||
                    detection.name ||
                    detection.label ||
                    "Pothole";

                detectionHTML += `
                    <tr>

                        <td style="
                            border:1px solid #ddd;
                            padding:8px;
                            text-align:center;
                        ">
                            ${index + 1}
                        </td>

                        <td style="
                            border:1px solid #ddd;
                            padding:8px;
                        ">
                            ${hazardName}
                        </td>

                        <td style="
                            border:1px solid #ddd;
                            padding:8px;
                        ">
                            ${confidence.toFixed(1)}%
                        </td>

                        <td style="
                            border:1px solid #ddd;
                            padding:8px;
                        ">
                            ${riskSymbol} ${risk}
                        </td>

                    </tr>
                `;

            });

            detectionHTML += `
                        </tbody>
                    </table>

                </div>
            `;

        }
        else {

            detectionHTML = `
                <div style="
                    margin-top:20px;
                    padding:15px;
                    background:#e8f5e9;
                    border-radius:8px;
                ">
                    🟢 No hazards detected in this image.
                </div>
            `;

        }


        /*
         * ----------------------------------------------------
         * FINAL RESULT
         * ----------------------------------------------------
         */

        result.innerHTML = `

            <div style="text-align:center;">

                <h3 style="color:green;">
                    ✅ Detection Completed
                </h3>

                <p>
                    <strong>File:</strong>
                    ${data.filename || imageFile.name}
                </p>

                <p>
                    <strong>Message:</strong>
                    ${data.message || "Image detected successfully"}
                </p>

                <div style="
                    margin:20px auto;
                    padding:15px;
                    background:#f5f5f5;
                    border-radius:10px;
                    max-width:500px;
                ">

                    <h3>
                        🚧 Hazards Detected:
                        ${total}
                    </h3>

                    <p>
                        🔴 High Risk:
                        <strong>${high}</strong>
                    </p>

                    <p>
                        🟠 Medium Risk:
                        <strong>${medium}</strong>
                    </p>

                    <p>
                        🟢 Low Risk:
                        <strong>${low}</strong>
                    </p>

                </div>

                ${detectionHTML}

            </div>
        `;


    }
    catch (error) {

        console.error("Detection error:", error);

        // Reset dashboard on error
        totalHazards.textContent = "0";
        highRisk.textContent = "0";
        mediumRisk.textContent = "0";
        lowRisk.textContent = "0";

        result.innerHTML = `

            <div style="
                padding:20px;
                background:#ffebee;
                border-radius:10px;
                text-align:center;
            ">

                <h3 style="color:#d32f2f;">
                    ❌ Detection Failed
                </h3>

                <p>
                    ${error.message}
                </p>

                <p style="font-size:14px;">
                    Make sure the Python backend is running on
                    <strong>http://127.0.0.1:5000</strong>
                </p>

            </div>
        `;
    }
}