import config from "@/lib/config";
import ImageKit from 'imagekit';

import { NextResponse } from "next/server";

// console.log("Testing in the imagekit api route....................")

// here we destructure for cleaner and more readable code.
const { env: {imagekit: {publicKey, privateKey, urlEndpoint}} } = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}