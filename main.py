from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Подключение статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# Подключение шаблонизатора Jinja2
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Модель данных для входных данных
class DeviceInfo(BaseModel):
    userAgent: str
    language: str
    timezone: str
    screenWidth: int
    screenHeight: int
    colorDepth: int
    pixelRatio: float
    cpuCores: str
    gpuVendor: str
    gpuRenderer: str
    batteryLevel: str
    isCharging: str

@app.post("/device-info")
async def device_info(data: DeviceInfo):
    # Пример обработки данных
    processed_data = {
        "Browser Info": {
            "User-Agent": data.userAgent,
            "Language": data.language,
            "Timezone": data.timezone,
        },
        "Screen Info": {
            "Resolution": f"{data.screenWidth}x{data.screenHeight}",
            "Color Depth": data.colorDepth,
            "Pixel Ratio": data.pixelRatio,
        },
        "Hardware Info": {
            "CPU Cores": data.cpuCores,
            "GPU Vendor": data.gpuVendor,
            "GPU Renderer": data.gpuRenderer,
        },
        "Battery Info": {
            "Level": data.batteryLevel,
            "Charging": data.isCharging,
        },
    }

    # Возвращаем обработанные данные клиенту
    return JSONResponse(content=processed_data)

# Запуск приложения
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)