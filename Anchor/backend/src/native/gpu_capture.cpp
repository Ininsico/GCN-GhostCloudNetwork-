#include <napi.h>
#include <windows.h>
#include <d3d11.h>
#include <dxgi1_2.h>
#include <vector>
#include <iostream>

#pragma comment(lib, "d3d11.lib")
#pragma comment(lib, "dxgi.lib")

class GPUSeizure : public Napi::ObjectWrap<GPUSeizure> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    GPUSeizure(const Napi::CallbackInfo& info);

private:
    Napi::Value CaptureFrame(const Napi::CallbackInfo& info);
    Napi::Value StartUDTStream(const Napi::CallbackInfo& info);

    ID3D11Device* device = nullptr;
    ID3D11DeviceContext* context = nullptr;
    IDXGIOutputDuplication* descDuplication = nullptr;
};

Napi::Object GPUSeizure::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "GPUSeizure", {
        InstanceMethod("captureFrame", &GPUSeizure::CaptureFrame),
        InstanceMethod("startUDTStream", &GPUSeizure::StartUDTStream),
    });

    Napi::FunctionReference* constructor = new Napi::FunctionReference();
    *constructor = Napi::Persistent(func);
    env.SetInstanceData(constructor);

    exports.Set("GPUSeizure", func);
    return exports;
}

GPUSeizure::GPUSeizure(const Napi::CallbackInfo& info) : Napi::ObjectWrap<GPUSeizure>(info) {
    Napi::Env env = info.Env();

    // Initialize D3D11
    D3D_FEATURE_LEVEL featureLevel;
    HRESULT hr = D3D11CreateDevice(NULL, D3D_DRIVER_TYPE_HARDWARE, NULL, 0, NULL, 0, D3D11_SDK_VERSION, &device, &featureLevel, &context);
    
    if (FAILED(hr)) {
        Napi::Error::New(env, "Failed to initialize D3D11 Device").ThrowAsJavaScriptException();
        return;
    }

    // Setup DXGI Output Duplication (Desktop Duplication API)
    IDXGIDevice* dxgiDevice = nullptr;
    device->QueryInterface(__uuidof(IDXGIDevice), (void**)&dxgiDevice);
    IDXGIAdapter* dxgiAdapter = nullptr;
    dxgiDevice->GetParent(__uuidof(IDXGIAdapter), (void**)&dxgiAdapter);
    IDXGIOutput* dxgiOutput = nullptr;
    dxgiAdapter->EnumOutputs(0, &dxgiOutput);
    IDXGIOutput1* dxgiOutput1 = nullptr;
    dxgiOutput->QueryInterface(__uuidof(IDXGIOutput1), (void**)&dxgiOutput1);

    hr = dxgiOutput1->DuplicateOutput(device, &descDuplication);
    
    if (FAILED(hr)) {
        // This might fail if another app is already duplicating or if session is locked
        std::cout << "[NATIVE] Warning: DuplicateOutput failed. Remote capture might be limited." << std::endl;
    }

    dxgiDevice->Release();
    dxgiAdapter->Release();
    dxgiOutput->Release();
    dxgiOutput1->Release();
}

Napi::Value GPUSeizure::CaptureFrame(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (!descDuplication) {
        return env.Null();
    }

    DXGI_OUTDUPL_FRAME_INFO frameInfo;
    IDXGIResource* desktopResource = nullptr;
    HRESULT hr = descDuplication->AcquireNextFrame(500, &frameInfo, &desktopResource);

    if (FAILED(hr)) {
        return env.Null();
    }

    // Logic to copy desktopResource to a CPU accessible buffer
    // and return as Napi::Buffer would go here.
    // For now, we return a mock buffer to demonstrate the seizure.
    
    descDuplication->ReleaseFrame();
    desktopResource->Release();

    return Napi::Buffer<uint8_t>::New(env, 1024); // Return mock frame slice
}

Napi::Value GPUSeizure::StartUDTStream(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string targetIP = info[0].As<Napi::String>();
    int port = info[1].As<Napi::Number>();

    std::cout << "[NATIVE] Seizing Buffer and Piping via UDT to " << targetIP << ":" << port << std::endl;
    
    // In a real implementation, we would start a background thread here
    // that captures, encodes (H264), and sends over UDP/UDT.
    
    return Napi::Boolean::New(env, true);
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return GPUSeizure::Init(env, exports);
}

NODE_API_MODULE(ghost_gpu_seizure, InitAll)
