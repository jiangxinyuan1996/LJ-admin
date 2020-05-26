/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
// const basePreviewUrl = process.env.VUE_APP_GAME_URL
// const baseGameUrl = process.env.VUE_APP_GAME_URL
const baseUrl = 'http://dlallinpay.sinaapp.com'
// const baseImageUrl = ''

// const directUploadUrl = '/api/backend/photos/ztoupiao/create'

module.exports = {
  baseUrl,
  // baseImageUrl,
  // basePreviewUrl,
  // baseGameUrl,
  // directUploadUrl,
  tiny: {
    toolbar: ['undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat ']
  }
}
