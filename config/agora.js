import dotenv from "dotenv";
dotenv.config();

export const agoraConfig = {
  appId: process.env.AGORA_APP_ID,
  appCertificate: process.env.AGORA_APP_CERTIFICATE,
};