document.addEventListener("DOMContentLoaded", function () {
    // Сбор данных о браузере
    const userAgent = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Сбор данных об экране
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const colorDepth = screen.colorDepth;
    const pixelRatio = window.devicePixelRatio;

    // Сбор данных о процессоре
    const cpuCores = navigator.hardwareConcurrency || "Unknown";

    // Сбор данных о GPU через WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let gpuVendor = "Unknown";
    let gpuRenderer = "Unknown";
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
    }

    // Сбор данных о батарее
    let batteryLevel = "N/A";
    let isCharging = "N/A";
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            batteryLevel = battery.level * 100 + "%";
            isCharging = battery.charging ? "Yes" : "No";

            // Отправка данных на сервер
            fetch('/device-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAgent,
                    language,
                    timezone,
                    screenWidth,
                    screenHeight,
                    colorDepth,
                    pixelRatio,
                    cpuCores,
                    gpuVendor,
                    gpuRenderer,
                    batteryLevel,
                    isCharging,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log("Server response:", data);
                document.getElementById("result").innerText = JSON.stringify(data, null, 2);
            });
        });
    }
});