import { ElMessageBox } from 'element-plus'

export const msgBoxConfirm = (message, title = '提示', options = {}) => {
  if (Object.keys(options).length === 0) {
    options = {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning'
    }
  }

  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, title, options)
    .then(() => {
      resolve()
    }).catch(() => {
      reject()
    })
  })
}