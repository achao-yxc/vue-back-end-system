import JSEncrypt from 'jsencrypt'

const crypt = new JSEncrypt({ default_key_size: 2048 })
const publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB2IEWD+SncLdHSs/yUv5lg\nhT+NpXX3uCV2v2AxYomakTFWl5N3U6x2okAiDRYHHtZ9IV98Muw/PnthQDzBweOB\nfhnU1aqOAqmclz2ISPV9+clcDTeVnBdA9bXQsRYuV3xo3S25VFodddU4gu7ROXxC\nBmy1hyoTk1oI31XtN2mTy9jY20WQQxluIhpy1/s3ym+7HubkJk6hlCpsCioSeU3j\ndzwo99K3D8ahuVC8URCgvJJlAvKL2DmVBehb4EJBRxbYID9agvDg/YW3j1+LYbpg\nRd+AdsXJdsrSbJX17z4GwToktKcXj6Yg89bGRxagz9CgnSb7vQQAfHQpdZgGMZ5Z\nAgMBAAE=\n-----END PUBLIC KEY-----"
crypt.setPublicKey(publicKey)

export function getKey() {
  const keypair = crypt.getKey(),
    publicKey = keypair.getPublicKey(),
    privateKey = keypair.getPrivateKey()

  return { publicKey, privateKey }
}

export function encrypt(text) {
  return crypt.encrypt(text)
}