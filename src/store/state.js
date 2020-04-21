export default {
    // 图片地址
    BASE_URL: process.env.NODE_ENV === 'development' ? 'http://39.106.137.233:8081/' : `${location.origin}/`,
    // BASE_URL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:9000/' : `${location.origin}/`,
    // 是否设置了basURL
    hasSetUrl: false
}