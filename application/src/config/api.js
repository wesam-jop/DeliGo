// API Configuration
// IMPORTANT: For Android/iOS devices, you cannot use 'localhost'
// You must use your computer's IP address instead
// 
// To find your IP address:
// - Windows: Run `ipconfig` in CMD and look for "IPv4 Address"
// - Mac/Linux: Run `ifconfig` or `ip addr` and look for your network interface IP
//
// Example: If your computer's IP is 192.168.1.100, use:
// const BASE_URL = 'http://192.168.1.100:8000/api/v1';
//
// For production, use your actual domain:
// const BASE_URL = 'https://yourdomain.com/api/v1';

// Development - Change this to your computer's IP address for testing on real devices
// For Android Emulator, the code will automatically use: http://10.0.2.2:8000/api/v1
// For iOS Simulator, you can use: http://localhost:8000/api/v1
// For real devices, use your computer's IP: http://YOUR_IP:8000/api/v1

// IMPORTANT: If you're testing on a REAL DEVICE, change this to your computer's IP!
// Your IP address: 192.168.1.100
const BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:8000/api/v1' // ✅ Updated to your IP address
  : 'https://yourdomain.com/api/v1'; // Production URL

export default BASE_URL;

