import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        // 테스트용 Basic Auth 헤더 (admin:admin123) - 비밀번호 불일치 시 401 발생하므로 주석 처리
        // 'Authorization': 'Basic ' + btoa('admin:admin123'),
    },
});

export default instance;
