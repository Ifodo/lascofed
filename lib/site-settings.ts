import { prisma } from "./prisma";

export type PublicSiteSettings = {
  radioStreamUrl: string;
  videoStreamUrl: string;
  callInPhone: string;
  whatsappNumber: string;
};

const defaultPublicSettings: PublicSiteSettings = {
  radioStreamUrl:
    process.env.NEXT_PUBLIC_RADIO_STREAM_URL ??
    "https://azstream.elektranbroadcast.com/listen/lascofed/radio.mp3",
  videoStreamUrl:
    process.env.NEXT_PUBLIC_VIDEO_STREAM_URL ??
    "https://ngvid.elektranbroadcast.com/hls/lascofed/mystream.m3u8",
  callInPhone: process.env.NEXT_PUBLIC_CALL_IN_PHONE ?? "+234 (0) 90 5871 6564",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+2349058716564",
};

const settingKeyMap = {
  radio_stream_url: "radioStreamUrl",
  video_stream_url: "videoStreamUrl",
  call_in_phone: "callInPhone",
  whatsapp_number: "whatsappNumber",
} as const;

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const settings = { ...defaultPublicSettings };

  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        scope: "PUBLIC",
        key: { in: Object.keys(settingKeyMap) },
      },
      select: {
        key: true,
        value: true,
      },
    });

    for (const row of rows) {
      const mappedKey = settingKeyMap[row.key as keyof typeof settingKeyMap];
      if (mappedKey) {
        settings[mappedKey] = row.value;
      }
    }
  } catch {
    return settings;
  }

  return settings;
}
