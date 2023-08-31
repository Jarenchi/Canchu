import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: NextRequest) {
  const data = await req.json();
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.params.response}`;
  const recaptchaResponse = await axios.post(url);
  console.log(recaptchaResponse.data);
  return new NextResponse(recaptchaResponse.data.score);
}
