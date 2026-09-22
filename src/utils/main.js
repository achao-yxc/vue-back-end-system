import { fileStream, fileStreamManual } from '@/api/main'

export const downloadFileWindow = (api, fileId) => {
  // const url = window.URL.createObjectURL(new Blob(['test'], { type: 'application/octet-stream' }))
  const url = `${window.location.origin}/api/${api}?_id=${fileId}`
}

const handleStream = (stream, fileName) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = URL.createObjectURL(new Blob([stream], {
    type: 'application/octer-stream',
  }))
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadFile = async (fileId, fileName) => {
  const stream = await fileStream({ _id: fileId })
  handleStream(stream, fileName)
}

export const downloadFileManual = async (fileId, fileName) => {
  const stream = await fileStreamManual({ _id: fileId })
  handleStream(stream, fileName)
}