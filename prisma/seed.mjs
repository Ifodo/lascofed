import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL ?? "admin@lascofed.com").toLowerCase().trim();
  const plainPassword = (process.env.ADMIN_SEED_PASSWORD ?? "").trim();
  const fullName = process.env.ADMIN_SEED_NAME ?? "COOP Radio Super Admin";

  if (!plainPassword) {
    throw new Error("ADMIN_SEED_PASSWORD is required to seed the first admin account.");
  }

  const passwordHash = await bcrypt.hash(plainPassword, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      fullName,
      email,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  const defaults = [
    {
      key: "radio_stream_url",
      value: process.env.NEXT_PUBLIC_RADIO_STREAM_URL ?? "https://azstream.elektranbroadcast.com/listen/lascofed/radio.mp3",
    },
    {
      key: "video_stream_url",
      value: process.env.NEXT_PUBLIC_VIDEO_STREAM_URL ?? "https://ngvid.elektranbroadcast.com/hls/lascofed/mystream.m3u8",
    },
    {
      key: "call_in_phone",
      value: process.env.NEXT_PUBLIC_CALL_IN_PHONE ?? "+234 (0) 90 5871 6564",
    },
    {
      key: "whatsapp_number",
      value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+2349058716564",
    },
  ];

  for (const item of defaults) {
    await prisma.siteSetting.upsert({
      where: {
        scope_key: {
          scope: "PUBLIC",
          key: item.key,
        },
      },
      update: {
        value: item.value,
      },
      create: {
        scope: "PUBLIC",
        key: item.key,
        value: item.value,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
