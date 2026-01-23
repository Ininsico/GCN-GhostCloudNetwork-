#include <napi.h>
#include <windows.h>
#include <d3d11.h>
#include <dxgi1_2.h>
#include <vector>
#include <iostream>
#include <thread>
#include <atomic>
#include <winsock2.h>
#include <ws2tcpip.h>

#pragma comment(lib, "d3d11.lib")
#pragma comment(lib, "dxgi.lib")
#pragma comment(lib, "ws2_32.lib")

class GPUSeizure : public Napi::ObjectWrap<GPUSeizure> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    GPUSeizure(const Napi::CallbackInfo& info);
    ~GPUSeizure();

private:
    Napi::Value CaptureFrame(const Napi::CallbackInfo& info);
    Napi::Value StartUDTStream(const Napi::CallbackInfo& info);
    Napi::Value StopStream(const Napi::CallbackInfo& info);

    void StreamingThread(std::string targetIP, int port);

    ID3D11Device* device = nullptr;
    ID3D11DeviceContext* context = nullptr;
    IDXGIOutputDuplication* descDuplication = nullptr;
    ID3D11Texture2D* stagingTexture = nullptr;
    
    std::atomic<bool> isStreaming{false};
    std::thread* streamThread = nullptr;
    SOCKET udpSocket = INVALID_SOCKET;
};

Napi::Object GPUSeizure::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "GPUSeizure", {
        InstanceMethod("captureFrame", &GPUSeizure::CaptureFrame),
        InstanceMethod("startUDTStream", &GPUSeizure::StartUDTStream),
        InstanceMethod("stopStream", &GPUSeizure::StopStream),
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
        std::cout << "[NATIVE] Warning: DuplicateOutput failed (0x" << std::hex << hr << "). Remote capture might be limited." << std::endl;
    } else {
        std::cout << "[NATIVE] DirectX Desktop Duplication initialized successfully" << std::endl;
    }

    dxgiDevice->Release();
    dxgiAdapter->Release();
    dxgiOutput->Release();
    dxgiOutput1->Release();

    // Initialize Winsock for UDP streaming
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);
}

GPUSeizure::~GPUSeizure() {
    isStreaming = false;
    if (streamThread && streamThread->joinable()) {
        streamThread->join();
        delete streamThread;
    }
    
    if (udpSocket != INVALID_SOCKET) {
        closesocket(udpSocket);
    }
    
    if (stagingTexture) stagingTexture->Release();
    if (descDuplication) descDuplication->Release();
    if (context) context->Release();
    if (device) device->Release();
    
    WSACleanup();
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

    // Get the texture from the resource
    ID3D11Texture2D* desktopTexture = nullptr;
    hr = desktopResource->QueryInterface(__uuidof(ID3D11Texture2D), (void**)&desktopTexture);
    
    if (SUCCEEDED(hr)) {
        D3D11_TEXTURE2D_DESC desc;
        desktopTexture->GetDesc(&desc);
        
        // Create staging texture if needed (CPU-accessible)
        if (!stagingTexture) {
            desc.Usage = D3D11_USAGE_STAGING;
            desc.BindFlags = 0;
            desc.CPUAccessFlags = D3D11_CPU_ACCESS_READ;
            desc.MiscFlags = 0;
            device->CreateTexture2D(&desc, nullptr, &stagingTexture);
        }
        
        // Copy GPU texture to CPU-accessible staging texture
        context->CopyResource(stagingTexture, desktopTexture);
        
        // Map the staging texture to get pixel data
        D3D11_MAPPED_SUBRESOURCE mappedResource;
        hr = context->Map(stagingTexture, 0, D3D11_MAP_READ, 0, &mappedResource);
        
        if (SUCCEEDED(hr)) {
            // Calculate frame size
            size_t frameSize = mappedResource.RowPitch * desc.Height;
            
            // Create Node.js buffer with actual frame data
            Napi::Buffer<uint8_t> buffer = Napi::Buffer<uint8_t>::Copy(
                env, 
                static_cast<uint8_t*>(mappedResource.pData), 
                frameSize
            );
            
            context->Unmap(stagingTexture, 0);
            desktopTexture->Release();
            descDuplication->ReleaseFrame();
            desktopResource->Release();
            
            return buffer;
        }
        
        desktopTexture->Release();
    }
    
    descDuplication->ReleaseFrame();
    desktopResource->Release();

    return env.Null();
}

Napi::Value GPUSeizure::StartUDTStream(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string targetIP = info[0].As<Napi::String>();
    int port = info[1].As<Napi::Number>();

    if (isStreaming) {
        Napi::Error::New(env, "Stream already running").ThrowAsJavaScriptException();
        return Napi::Boolean::New(env, false);
    }

    std::cout << "[NATIVE] Starting real GPU capture stream to " << targetIP << ":" << port << std::endl;
    
    // Create UDP socket
    udpSocket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (udpSocket == INVALID_SOCKET) {
        Napi::Error::New(env, "Failed to create UDP socket").ThrowAsJavaScriptException();
        return Napi::Boolean::New(env, false);
    }

    // Start streaming thread
    isStreaming = true;
    streamThread = new std::thread(&GPUSeizure::StreamingThread, this, targetIP, port);
    
    return Napi::Boolean::New(env, true);
}

Napi::Value GPUSeizure::StopStream(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (!isStreaming) {
        return Napi::Boolean::New(env, false);
    }
    
    std::cout << "[NATIVE] Stopping GPU stream..." << std::endl;
    isStreaming = false;
    
    if (streamThread && streamThread->joinable()) {
        streamThread->join();
        delete streamThread;
        streamThread = nullptr;
    }
    
    if (udpSocket != INVALID_SOCKET) {
        closesocket(udpSocket);
        udpSocket = INVALID_SOCKET;
    }
    
    return Napi::Boolean::New(env, true);
}

void GPUSeizure::StreamingThread(std::string targetIP, int port) {
    std::cout << "[NATIVE] Streaming thread started" << std::endl;
    
    // Setup target address
    sockaddr_in targetAddr;
    targetAddr.sin_family = AF_INET;
    targetAddr.sin_port = htons(port);
    inet_pton(AF_INET, targetIP.c_str(), &targetAddr.sin_addr);
    
    const int MTU = 1400; // Safe UDP packet size
    uint32_t frameCounter = 0;
    
    while (isStreaming) {
        if (!descDuplication) {
            Sleep(100);
            continue;
        }
        
        // Capture frame
        DXGI_OUTDUPL_FRAME_INFO frameInfo;
        IDXGIResource* desktopResource = nullptr;
        HRESULT hr = descDuplication->AcquireNextFrame(16, &frameInfo, &desktopResource); // ~60 FPS
        
        if (FAILED(hr)) {
            Sleep(1);
            continue;
        }
        
        // Get texture
        ID3D11Texture2D* desktopTexture = nullptr;
        hr = desktopResource->QueryInterface(__uuidof(ID3D11Texture2D), (void**)&desktopTexture);
        
        if (SUCCEEDED(hr)) {
            // Copy to staging texture
            context->CopyResource(stagingTexture, desktopTexture);
            
            // Map and send
            D3D11_MAPPED_SUBRESOURCE mappedResource;
            hr = context->Map(stagingTexture, 0, D3D11_MAP_READ, 0, &mappedResource);
            
            if (SUCCEEDED(hr)) {
                D3D11_TEXTURE2D_DESC desc;
                stagingTexture->GetDesc(&desc);
                size_t frameSize = mappedResource.RowPitch * desc.Height;
                uint8_t* frameData = static_cast<uint8_t*>(mappedResource.pData);
                
                // Send frame in chunks (UDP has size limits)
                uint32_t totalChunks = (frameSize + MTU - 1) / MTU;
                
                for (uint32_t chunk = 0; chunk < totalChunks && isStreaming; chunk++) {
                    size_t offset = chunk * MTU;
                    size_t chunkSize = std::min((size_t)MTU, frameSize - offset);
                    
                    // Simple header: [frameCounter(4)][chunkIndex(4)][totalChunks(4)][data...]
                    std::vector<uint8_t> packet(12 + chunkSize);
                    memcpy(&packet[0], &frameCounter, 4);
                    memcpy(&packet[4], &chunk, 4);
                    memcpy(&packet[8], &totalChunks, 4);
                    memcpy(&packet[12], frameData + offset, chunkSize);
                    
                    sendto(udpSocket, (char*)packet.data(), packet.size(), 0, 
                           (sockaddr*)&targetAddr, sizeof(targetAddr));
                }
                
                context->Unmap(stagingTexture, 0);
                frameCounter++;
            }
            
            desktopTexture->Release();
        }
        
        descDuplication->ReleaseFrame();
        desktopResource->Release();
    }
    
    std::cout << "[NATIVE] Streaming thread stopped" << std::endl;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return GPUSeizure::Init(env, exports);
}

NODE_API_MODULE(ghost_gpu_seizure, InitAll)
